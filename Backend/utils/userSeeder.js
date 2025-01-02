const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/userModel"); // Path to your User model
const bcrypt = require("bcryptjs");
//mongoDb connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Androhuman:UI1rwOTc7JWJFiQY@cluster-bloodbank.eolrfvo.mongodb.net/bloodbank",
      {
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      }
    );
    console.log(`connected To MongoDb Database ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`MongoDb Database Error ${error}`);
  }
};

// Generate random data for user
const generateRandomUser = async (role) => {
  const password = "123456"; // Default password for all users
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  const user = {
    role: role,
    email: faker.internet.email(),
    password: hashedPassword,
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
  };

  // Role-specific data
  if (role === "donor" || role === "admin") {
    user.name = faker.person.fullName();
  } else if (role === "organisation") {
    user.organisationName = faker.company.name();
  } else if (role === "hospital") {
    user.hospitalName = faker.company.name();
  }
  console.log("role", role, "user", user);
  return user;
};

// Seed the database with users (organisations, hospitals, and donors)
const seedUsers = async () => {
  try {
    // Generate users
    const organisationUsers = [];
    const hospitalUsers = [];
    const donorUsers = [];

    // Generate 3 organisation users
    for (let i = 0; i < 3; i++) {
      organisationUsers.push(await generateRandomUser("organisation"));
    }

    // Generate 5 hospital users
    for (let i = 0; i < 5; i++) {
      hospitalUsers.push(await generateRandomUser("hospital"));
    }

    // Generate 10 donor users
    for (let i = 0; i < 10; i++) {
      donorUsers.push(await generateRandomUser("donor"));
    }

    // Create all users in the database
    const allUsers = [...organisationUsers, ...hospitalUsers, ...donorUsers];
    console.log("allUsers", allUsers);
    const createdUsers = await User.insertMany(allUsers);

    console.log(`${createdUsers.length} users created.`);

    // Collect user IDs for the Inventory seeding
    const organisationIds = createdUsers
      .filter((user) => user.role === "organisation")
      .map((user) => user._id);
    const hospitalIds = createdUsers
      .filter((user) => user.role === "hospital")
      .map((user) => user._id);
    const donorIds = createdUsers
      .filter((user) => user.role === "donor")
      .map((user) => user._id);

    // // Log the user IDs to be used later in inventory creation
    console.log("Organisation IDs:", organisationIds);
    console.log("Hospital IDs:", hospitalIds);
    console.log("Donor IDs:", donorIds);

    return {
      organisationIds: organisationIds,
      hospitalIds: hospitalIds,
      donorIds: donorIds,
    };
    return;
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

// Run the seeder
const runSeeder = async () => {
  // const result =
  // console.log("result", result);
  await connectDB();
  const { organisationIds, hospitalIds, donorIds } = await seedUsers();

  //   You can now use these IDs to create inventory records
  console.log("User IDs generated for Inventory seeding:");
  console.log("Organisation IDs:", organisationIds);
  console.log("Hospital IDs:", hospitalIds);
  console.log("Donor IDs:", donorIds);
};

runSeeder();

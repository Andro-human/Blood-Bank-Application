const mongoose = require("mongoose");
const Inventory = require("../models/inventoryModel");
const { faker } = require("@faker-js/faker");

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

const getRandomDate = (startYear = 2022, endYear = 2024) => {
  const start = new Date(startYear, 0, 1); // Jan 1 of startYear
  const end = new Date(endYear, 11, 31); // Dec 31 of endYear

  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const organisationIds = [
  "6581c3b98c2c1025afdbae57",
  "676efe62fdc3c17a8716533f",
  "676efe62fdc3c17a87165340",
];

const hospitalIds = [
  "6582b8fbd31349967b28609a",
  "676efe62fdc3c17a87165342",
  "676efe62fdc3c17a87165343",
  "676efe62fdc3c17a87165344",
  "676efe62fdc3c17a87165345",
];

const donorIds = [
  "6511b9c27469d135a84d1a61",
  "676efe62fdc3c17a87165347",
  "676efe62fdc3c17a87165348",
  "676efe62fdc3c17a87165349",
  "676efe62fdc3c17a8716534a",
  "676efe62fdc3c17a8716534b",
  "676efe62fdc3c17a8716534c",
  "676efe62fdc3c17a8716534d",
  "676efe62fdc3c17a8716534e",
  "676efe62fdc3c17a8716534f",
];

const generateRandomData = () => {
  const inventoryType = Math.random() > 0.5 ? "in" : "out";
  const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-"];
  const bloodGroup =
    bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
  const quantity = Math.floor(Math.random() * 10) + 1;
  const email = faker.internet.email();

  const organisation =
    organisationIds[Math.floor(Math.random() * organisationIds.length)];
  let hospital = null;
  let donor = null;

  if (inventoryType === "out") {
    hospital = hospitalIds[Math.floor(Math.random() * hospitalIds.length)];
  } else {
    donor = donorIds[Math.floor(Math.random() * donorIds.length)];
  }

  const record = {
    inventoryType,
    bloodGroup,
    quantity,
    email,
    organisation,
    hospital,
    donor,
    createdAt: getRandomDate(),
  };

  return record;
};

const seedInventory = async () => {
  try {
    await Inventory.deleteMany(); // Optional: Clear existing data
    console.log("Existing data cleared.");

    const records = [];
    for (let i = 0; i < 200; i++) {
      const record = generateRandomData();
      records.push(record);
    }

    await Inventory.insertMany(records);
    console.log("Inventory data seeded successfully.");
  } catch (error) {
    console.error("Error seeding inventory data:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedInventory();
};

runSeeder();

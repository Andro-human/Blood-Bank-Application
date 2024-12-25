const express = require("express");
const dotenv = require("dotenv");
// const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
//dot config
dotenv.config();

//mongoDb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json()); //Now we can handle JSON response in our application
<<<<<<< HEAD
app.use(cors());          // we can call this server anywhere from the internet
=======
app.use(cors());
>>>>>>> 46de003f523bb93fec4d7063fa61d964c05e8384
app.use(morgan("dev"));

//routes
// 1 test route
<<<<<<< HEAD
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));

// //Static Folder
// app.use(express.static(path.join(__dirname, "../client/build")));

// //Static Routes
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });
=======
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));

//Static Folder
app.use(express.static(path.join(__dirname, "../client/build")));

//Static Routes
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
>>>>>>> 46de003f523bb93fec4d7063fa61d964c05e8384

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running in ${process.env.DEV_MODE} Port http://localhost:${PORT}`
  );
});

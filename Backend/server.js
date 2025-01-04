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
app.use(cors());
app.use(morgan("dev"));

//routes
// 1 test route

app.use("/", (req, res, next) => {
  if (req.path === "/") {
    console.log("Server is Running");
    return res.status(200).send({
      success: true,
      message: "Server is Running",
    });
  }
  next();
});

app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/predict", require("./routes/predictionRoutes"));

//Static Folder
// app.use(express.static(path.join(__dirname, "../client/build")));

// //Static Routes
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running in ${process.env.DEV_MODE} Port http://localhost:${PORT}`
  );
});

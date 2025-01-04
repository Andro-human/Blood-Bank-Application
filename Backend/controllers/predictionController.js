const mongoose = require("mongoose");
const predictionModel = require("../models/predictionModel");

const insertPredictions = async (req, res) => {
  try {
    const { predictions } = req.body;
    if (
      !predictions ||
      !Array.isArray(predictions) ||
      predictions.length === 0
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    await predictionModel.deleteMany();

    await predictionModel.insertMany(predictions);

    res.status(201).json({ message: "Predictions inserted successfully!" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Some predictions already exist!" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const monthlyPrediction = async (req, res) => {
  try {
    const monthlyData = await predictionModel.find({
      predictionType: "monthly_avg",
    }).sort({ bloodType: 1, index: 1 }); // First, sort by bloodType, then by index

    let totalValue = 0;
    const groupedData = monthlyData.reduce((acc, item) => {
      if (!acc[item.bloodType]) {
        acc[item.bloodType] = [];
      }
      if (item.value < 0) item.value = 0;
      acc[item.bloodType].push(item.value);
      totalValue += item.value;
      return acc;
    }, {});

    res.status(200).json({
      status: "sucess",
      message: "Monthly data fetched and grouped by bloodType successfully!",
      data: groupedData,
      totalValue
    });
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    res.status(500).json({
      status: "failed",
      message: "An error occurred while fetching the data.",
      error: error.message,
    });
  }
};

const yearlyPrediction = async (req, res) => {
  try {
    const yearlyData = await predictionModel.find({
      predictionType: "yearly_avg",
    }).sort({ bloodType: 1, index: 1 });

    const groupedData = yearlyData.reduce((acc, item) => {
      if (!acc[item.bloodType]) {
        acc[item.bloodType] = [];
      }
      if (item.value < 0) item.value = 0;
      acc[item.bloodType].push(item.value);
      return acc;
    }, {});

    res.status(200).json({
      status: "sucess",
      message: "Yearly data fetched and grouped by bloodType successfully!",
      data: groupedData,
    });
  } catch (error) {
    console.error("Error fetching yearly data:", error);
    res.status(500).json({
      status: "failed",
      message: "An error occurred while fetching the data.",
      error: error.message,
    });
  }
};

module.exports = { insertPredictions, monthlyPrediction, yearlyPrediction };

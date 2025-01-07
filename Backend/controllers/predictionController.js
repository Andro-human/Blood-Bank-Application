const mongoose = require("mongoose");
const predictionModel = require("../models/predictionModel");
const userModel = require("../models/userModel");
const axios = require("axios");

const insertPredictions = async (req, res) => {
  try {
    const { predictions, organisationId } = req.body;
    
    if (
      !predictions ||
      !Array.isArray(predictions) ||
      predictions.length === 0 ||
      !organisationId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    // Delete predictions for the specific organisationId
    await predictionModel.deleteMany({ organisation: organisationId });

    // Insert new predictions
    await predictionModel.insertMany(predictions);

    res
      .status(201)
      .json({ success: true, message: "Predictions inserted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const monthlyPrediction = async (req, res) => {
  try {
    let organisationId = req.body?.userId;
    if (!organisationId)
      return res.status(400).send({
        success: false,
        message: "No organisationId found",
      });
    const monthlyData = await predictionModel
      .find({
        predictionType: "monthly_avg",
        organisation: organisationId
      })
      .sort({ bloodType: 1, index: 1 }); // First, sort by bloodType, then by index
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
      totalValue,
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
    let organisationId = req.body?.userId;
    if (!organisationId)
      return res.status(400).send({
        success: false,
        message: "No organisationId found",
      });

    const yearlyData = await predictionModel
      .find({
        predictionType: "yearly_avg",
        organisation: organisationId
      })
      .sort({ bloodType: 1, index: 1 });

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

const fetchLatestPrediction = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "No userId found",
      });
    }
    const user = await userModel.findById({ _id: userId });
    if (user.role !== "organisation") {
      return res.status(400).send({
        success: false,
        message: "Invalid user role",
      });
    }

    const response = await axios.post(
      `${process.env.PREDICT_URL}/api/predictions`,
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 300000,
      }
    );

    if (response?.status) {
      return res.status(201).send({
        success: true,
        message: "Predictions Fetched Successfully",
      });
    } else console.log(response?.error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch prediction from external API",
    });
  } catch (error) {
    return res.status(500).send({
      success: "false",
      message: "Error in Fetch Latest Prediction Api",
      error,
    });
  }
};

module.exports = {
  insertPredictions,
  monthlyPrediction,
  yearlyPrediction,
  fetchLatestPrediction,
};

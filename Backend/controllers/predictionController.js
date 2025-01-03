const mongoose = require("mongoose");
const predictionModel = require("../models/predictionModel");

const insertPredictions = async (req, res) => {
  try {
    await predictionModel.deleteMany();
    const { bloodType, index, value, predictionType } = req.body;
    if (!bloodType || !index || !value || !predictionType ) {
      return res.status(400).json({ message: "Invalid input data", predictions });
    }

    const newPrediction = new predictionModel({
        bloodType,
        index,
        value,
        predictionType
    });

    console.log("here");
    await newPrediction.save();

    res.status(201).json({ message: "Predictions inserted successfully!" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Predictions already exist!" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { insertPredictions };

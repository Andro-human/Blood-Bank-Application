const mongoose = require("mongoose");
const predictionModel = require("../models/predictionModel");

const insertPredictions = async (req, res) => {
    try {
      const { predictions } = req.body;
  
      if (!predictions) {
        return res.status(400).json({ message: 'Invalid input data' });
      }
  
      const newPrediction = new predictionModel({
        predictions: {
          Blood_Group_AP: predictions['A+'].monthly_averages,
          Blood_Group_AM: predictions['A-'].monthly_averages,
          Blood_Group_BP: predictions['B+'].monthly_averages,
          Blood_Group_BM: predictions['B-'].monthly_averages,
          Blood_Group_OP: predictions['O+'].monthly_averages,
          Blood_Group_OM: predictions['O-'].monthly_averages,
        },
      });
  
      await newPrediction.save();
  
      res.status(201).json({ message: 'Predictions inserted successfully!' });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Predictions already exist!' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = { insertPredictions };
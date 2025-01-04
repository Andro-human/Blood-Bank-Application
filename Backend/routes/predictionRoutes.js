const express = require("express");
const { insertPredictions, monthlyPrediction, yearlyPrediction } = require("../controllers/predictionController");
const router = express.Router();

router.post('/insertPredictions', insertPredictions);
router.get('/fetchMonthlyPredictions', monthlyPrediction);
router.get('/fetchYearlyPredictions', yearlyPrediction);
module.exports = router;
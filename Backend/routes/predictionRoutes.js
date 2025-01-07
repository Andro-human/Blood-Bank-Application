const express = require("express");
const { insertPredictions, monthlyPrediction, yearlyPrediction, fetchLatestPrediction } = require("../controllers/predictionController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/insertPredictions', insertPredictions);
router.get('/fetchMonthlyPredictions', authMiddleware, monthlyPrediction);
router.get('/fetchYearlyPredictions', authMiddleware, yearlyPrediction);
router.get('/fetchLatestPredictions', authMiddleware, fetchLatestPrediction);
module.exports = router;
const express = require("express");
const { insertPredictions } = require("../controllers/predictionController");
const router = express.Router();

router.post('/insertPrediction', insertPredictions);

module.exports = router;
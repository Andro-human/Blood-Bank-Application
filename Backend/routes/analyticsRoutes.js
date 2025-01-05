const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { bloodGroupDetails } = require("../controllers/analyticsController");
const router = express.Router();

router.get('/bloodData', authMiddleware, bloodGroupDetails);

module.exports = router;
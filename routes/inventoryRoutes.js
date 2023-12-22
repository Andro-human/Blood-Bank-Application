const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createInventoryController,
  getInventoryController,
  getDonorsController,
  getHospitalContoller,
  getOrganisationController,
  getOrganisationHospitalController,
  getInventoryHospitalController,
} = require("../controllers/inventoryController");

const router = express.Router();

//routes
//ADD INVENTORY || POST
router.post("/create-inventory", authMiddleware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddleware, getInventoryController);

//GET Hospital BLOOD RECORDS (method is post because we are sending filters)
router.post("/get-inventory-hospital", authMiddleware, getInventoryHospitalController);

//GET DONOR RECORDS
router.get("/get-donors", authMiddleware, getDonorsController);

//GET HOSPITAL RECORDS
router.get("/get-hospitals", authMiddleware, getHospitalContoller);

//GET Organisation for DONOR
router.get("/get-organisations-donor", authMiddleware, getOrganisationController);

//GET Organisation for Hospital
router.get("/get-organisations-hospital", authMiddleware, getOrganisationHospitalController);

module.exports = router;

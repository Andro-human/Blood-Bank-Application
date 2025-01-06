const express = require("express");
const {
  getDonorsListController,
  getHospitalListController,
  getOrgListController,
  deleteController,
  totalDonations,
  donationsActivity,
  totalAvailable,
  donationsActivityByQuater,
  getLast7Records,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();


router.get(
  "/donor-list",
  authMiddleware,
  adminMiddleware,
  getDonorsListController
);

router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalListController
);
router.get("/org-list", authMiddleware, adminMiddleware, getOrgListController);

router.get("/total-donations", authMiddleware, adminMiddleware, totalDonations);
router.get("/recent-activity", authMiddleware, adminMiddleware, donationsActivity);
router.get("/total-available", authMiddleware, adminMiddleware, totalAvailable);
router.get("/total-donations-quater", authMiddleware, adminMiddleware, donationsActivityByQuater);
router.get("/last-seven-donations", authMiddleware, adminMiddleware, getLast7Records);


router.delete(
  "/delete-user/:id",
  authMiddleware,
  adminMiddleware,
 deleteController
);

module.exports = router;
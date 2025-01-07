const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");

const bloodGroupDetails = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-"];
    const currOrganisation = new mongoose.Types.ObjectId(req.body.userId);
    if (!currOrganisation) {
      return res.status(400).send({
        success: false,
        message: "Invalid userId provided",
      });
    }

    // Fetch all data in a single query
    const inventoryData = await inventoryModel.aggregate([
      {
        $group: {
          _id: {
            organisation: "$organisation",
            bloodGroup: "$bloodGroup",
            inventoryType: "$inventoryType",
          },
          total: { $sum: "$quantity" },
        },
      },
    ]);

    const bloodGroupData = bloodGroups.map((bloodGroup) => {
      const totalIn =
        inventoryData.find(
          (item) =>
            item._id.organisation.toString() === currOrganisation.toString() && 
            item._id.bloodGroup === bloodGroup &&
            item._id.inventoryType === "in"
        )?.total || 0;

      const totalOut =
        inventoryData.find(
          (item) =>
            item._id.organisation.toString() === currOrganisation.toString() && 
            item._id.bloodGroup === bloodGroup &&
            item._id.inventoryType === "out"
        )?.total || 0;
      const totalAvailable = totalIn - totalOut;

      return { bloodGroup, totalIn, totalOut, totalAvailable };
    });

    return res.status(200).send({
      success: true,
      message: "Blood Group Data fetched successfully",
      bloodGroupData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in BloodGroup Details",
      error,
    });
  }
};

module.exports = { bloodGroupDetails };

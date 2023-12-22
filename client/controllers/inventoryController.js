const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    // validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (inventoryType == "in" && user.role !== "donor") {
    //   throw new Error("Not a donor account");
    // }
    // if (inventoryType == "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.organisation);

      //calculate Blood Quantity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: `$bloodGroup`,
            total: { $sum: `$quantity` },
          },
        },
      ]);

      // console.log(`Total In`, totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      //calculate OUT blood Quantity
      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: `$bloodGroup`,
            total: { $sum: `$quantity` },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & out calc
      const availableQuantityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(400).send({
          success: false,
          message: `Only ${availableQuantityOfBloodGroup}ML of ${requestedBloodGroup} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donor = user?._id;
    }
    // save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Record Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Create Inventory API",
      error,
    });
  }
};

// GET ALL BLOOD RECORDS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donor")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all records operation successful",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get all inventory api",
    });
  }
};

// GET Hospital BLOOD RECORDS
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donor")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get Hospital Consumer records operation successful",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Consumer inventory api",
    });
  }
};

// Get donor records
const getDonorsController = async (req, res) => {
  try {
    const organisation = req.body.userId;

    //find Donors
    const donorId = await inventoryModel.distinct("donor", {
      organisation,
    });
    console.log(donorId);
    const donors = await userModel.find({ _id: { $in: donorId } });

    return res.status(200).send({
      success: true,
      message: "Donor Record Fetched Successfully",
      donors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donor records",
      error,
    });
  }
};

// Get hostpital records
const getHospitalContoller = async (req, res) => {
  try {
    const organisation = req.body.userId;

    //get Hospital ID
    const HospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    });
    // console.log(HospitalId);
    //find hospital
    const hospitals = await userModel.find({
      _id: { $in: HospitalId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get Hospital API",
      error
    });
  }
};

//Get organisations for donor
const getOrganisationController = async(req, res) => {
  try {
    const donor = req.body.userId
    const orgId = await inventoryModel.distinct('organisation', {donor})
    
    //find  org
    const organisations = await userModel.find({
      _id: {$in: orgId}
    })
    return res.status(200).send({
      success:true,
      message: 'Donor Org Data Fetched Successfully',
      organisations
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message: 'Error in Donor Org API',
      error
    })
  }
};

// Get Organisation for Hospital
const getOrganisationHospitalController = async(req, res) => {
  try {
    const hospital = req.body.userId
    const orgId = await inventoryModel.distinct('organisation', {hospital})
    
    //find  org
    const organisations = await userModel.find({
      _id: {$in: orgId}
    })
    return res.status(200).send({
      success:true,
      message: 'Hospital Org Data Fetched Successfully',
      organisations
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message: 'Error in Hospital Org API',
      error
    })
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonorsController,
  getHospitalContoller,
  getOrganisationController,
  getOrganisationHospitalController,
  getInventoryHospitalController
};

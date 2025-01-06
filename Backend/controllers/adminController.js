const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

//GET DONAR LIST
const getDonorsListController = async (req, res) => {
  try {
    const donorData = await userModel
      .find({ role: "donor" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: donorData.length,
      message: "Donor List Fetched Successfully",
      donorData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error In Donor List API",
      error,
    });
  }
};
//GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: hospitalData.length,
      message: "HOSPITAL List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error In Hospital List API",
      error,
    });
  }
};
//GET ORG LIST
const getOrgListController = async (req, res) => {
  try {
    const orgData = await userModel
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: orgData.length,
      message: "ORG List Fetched Successfully",
      orgData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error In ORG List API",
      error,
    });
  }
};
// =======================================

//DELETE DONAR
const deleteController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: " Record Deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while deleting ",
      error,
    });
  }
};

const totalAvailable = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-"];

    const inventoryData = await inventoryModel.aggregate([
      {
        $group: {
          _id: {
            bloodGroup: "$bloodGroup",
            inventoryType: "$inventoryType",
          },
          total: { $sum: "$quantity" },
        },
      },
    ]);
    let totalAvailable = 0;
    const bloodWiseAvailable = [];
    // Transform the data
    for (let i = 0; i < bloodGroups.length; i++) {
        const bloodGroup = bloodGroups[i];
      
        const totalIn =
          inventoryData.find(
            (item) =>
              item._id.bloodGroup === bloodGroup &&
              item._id.inventoryType === "in"
          )?.total || 0;
      
        const totalOut =
          inventoryData.find(
            (item) =>
              item._id.bloodGroup === bloodGroup &&
              item._id.inventoryType === "out"
          )?.total || 0;
      
        const currAvailable = totalIn - totalOut;
        bloodWiseAvailable.push({bloodGroup, currAvailable})
        totalAvailable += currAvailable;
      }

    return res.status(200).send({
      success: true,
      message: "total available fetched successfully",
      totalAvailable,
      bloodWiseAvailable
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in BloodGroup Details",
      error,
    });
  }
};

const totalDonations = async (req, res) => {
  try {
    const totalCount = await inventoryModel.countDocuments();

    return res.status(200).send({
      success: true,
      message: "Total number of records fetched successfully",
      totalRecords: totalCount,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in fetching total records",
      error,
    });
  }
};

const donationsActivity = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const lastWeekCount = await inventoryModel.countDocuments({
      createdAt: { $gte: oneWeekAgo }, // Assuming `createdAt` field exists
    });

    return res.status(200).send({
      success: true,
      message: "Number of records in the last week fetched successfully",
      lastWeekRecords: lastWeekCount,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in fetching records from the last week",
      error,
    });
  }
};

const donationsActivityByQuater = async (req, res) => {
    try {
      // Get the date 6 months ago
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
      // Aggregate records by month in the last 6 months
      const activityByMonth = await inventoryModel.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo }, // Filter records created in the last 6 months
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" }, // Extract year from the `createdAt` field
              month: { $month: "$createdAt" }, // Extract month from the `createdAt` field
            },
            count: { $sum: 1 }, // Count the number of records per group
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
        },
      ]);

      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
  
      // Format the response for easier interpretation
      const formattedData = activityByMonth.map((item) => ({
        month: monthNames[item._id.month-1],
        donations: item.count,
      }));
  
      return res.status(200).send({
        success: true,
        message: "Records for the last 6 months fetched successfully",
        activityByMonth: formattedData,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Error in fetching records for the last 6 months",
        error,
      });
    }
};

const getLast7Records = async (req, res) => {
    try {
      // Fetch the last 7 records, sorted by createdAt in descending order
      const last7Records = await inventoryModel
        .find() // or specify any filtering conditions if needed
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (most recent first)
        .limit(7); // Limit the result to 7 records
  
      return res.status(200).send({
        success: true,
        message: "Last 7 records fetched successfully",
        last7Records,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Error in fetching last 7 records",
        error,
      });
    }
};
  

//EXPORT
module.exports = {
  getDonorsListController,
  getHospitalListController,
  getOrgListController,
  deleteController,
  totalAvailable,
  totalDonations,
  donationsActivity,
  donationsActivityByQuater,
  getLast7Records
};

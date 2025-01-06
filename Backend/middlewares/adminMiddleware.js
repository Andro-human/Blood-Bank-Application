const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (user?.role !== "admin") {
      return res.status(401).send({
        success: false,
        messaage: "Auth Failed",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Auth Failed, ADMIN API",
      error,
    });
  }
};

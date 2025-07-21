const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("../utils/appError");

exports.validateUser = (req, res, next) => {
  let token;

  if (
    !req.header.authorization ||
    !req.header.authorization.startsWith("Bearer")
  ) {
    return next(new AppError("User not verified", 400));
  }

  token = req.header.authorization.split(' ')[1]

  
};

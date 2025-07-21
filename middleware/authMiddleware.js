const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.validateUser = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.header.authorization ||
    req.header.authorization.startsWith("Bearer")
  ) {
    token = req.header.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("User not logged in. Please log in to continue", 400)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user which this token belong to no longer exist", 404)
    );
  }

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password, Please login again", 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new AppError("You cannot access this", 400));
    }
    next();
  };
};

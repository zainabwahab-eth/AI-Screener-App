const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Job = require("../model/jobModel");

exports.validateUser = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("User not logged in. Please log in to continue", 400)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

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
    // console.log(req.user)
    if (req.user.role !== role) {
      return next(new AppError("You cannot access this", 403));
    }
    next();
  };
};

exports.checkOwnership = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError("Cannot find job", 401));
  }

  if (req.user.id !== job.recruiterId.toString()) {
    return next(
      new AppError(
        "You cannot perform this action because you are not the owner of this job",
        401
      )
    );
  }

  req.job = job;
  next();
});

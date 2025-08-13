const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const getAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  console.log(token);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    user,
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!role || !["applicant", "recruiter"].includes(role)) {
    return next(
      new AppError(
        "Role is required and must be either applicant or recruiter",
        400
      )
    );
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role,
  });

  getAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter email and password", 401));
  }

  const user = await User.findOne({ email });

  if (!user || !user.isValidPassword(password)) {
    return next(new AppError("Password or email not correct", 401));
  }

  getAndSendToken(user, 201, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
};

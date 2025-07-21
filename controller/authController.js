const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  const token = signToken(newUser.id);

  return res.status(201).json({
    status: "sucess",
    token,
    data: {
      user: newUser,
    },
  });
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

  const token = signToken(user.id);

  return res.status(200).json({
    status: "sucess",
    token,
  });
});

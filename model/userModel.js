const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please enter your name"],
    },
    email: {
      type: String,
      require: [true, "Please enter your email"],
      unique: [true, "Someone else already used this emal"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      require: [true, "Please enter your password"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["recruiter", "jobseeker"],
      default: "jobseeker",
    },
    passwordChangedAt: String,
  },
  { timeStamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 15);
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

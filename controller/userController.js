const AppError = require("../utils/appError");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const logoUpload = require("./../utils/logoUpload");

exports.uploadLogo = logoUpload.single("logo");

exports.onboardRecruiter = catchAsync(async (req, res, next) => {
  const recruiterId = req.user.id;
  const { companyName, industry, website } = req.body;
  const logo = req.file;
  console.log(logo);

  const exsitingUser = await User.findById(recruiterId);

  if (exsitingUser.company?.hasCompletedOnboarding) {
    return next(new AppError("You have already completed onboarding", 400));
  }

  const updateData = {
    company: {
      hasCompletedOnboarding: true,
    },
  };

  if (companyName) updateData.company.name = companyName;
  if (industry) updateData.company.industry = industry;
  if (website) updateData.company.website = website;

  if (logo) {
    updateData.company.logo = {
      logoname: logo.originalname,
      cloudinary_id: logo.filename,
      url: logo.path,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(recruiterId, updateData, {
    new: true,
    runValidators: true,
  });

  return res.status(201).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

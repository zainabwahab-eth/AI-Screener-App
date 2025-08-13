const AppError = require("../utils/appError");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const logoUpload = require("./../utils/logoUpload");

exports.uploadLogo = logoUpload.single("logo");

exports.uploadProfilePics = logoUpload.single("profilePics");

exports.onboardRecruiter = catchAsync(async (req, res, next) => {
  const recruiterId = req.user.id;

  const existingUser = await User.findById(recruiterId);
  if (existingUser.hasCompletedOnboarding) {
    return next(new AppError("You have already completed onboarding", 400));
  }

  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(
      new AppError(
        "Please fill at least one field before completing onboarding",
        400
      )
    );
  }

  const { companyName, industry, website } = req.body;
  const logo = req.file;

  const updateData = {
    hasCompletedOnboarding: true,
    applicant: {},
  };

  if (companyName) updateData.applicant.name = companyName;
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

exports.onboardApplicant = catchAsync(async (req, res, next) => {
  console.log("im here onboard");
  const applicantId = req.user.id;

  const existingUser = await User.findById(applicantId);
  if (existingUser.hasCompletedOnboarding) {
    return next(new AppError("You have already completed onboarding", 400));
  }

  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(
      new AppError(
        "Please fill at least one field before completing onboarding",
        400
      )
    );
  }

  const { bio, interests, website } = req.body;
  const profilePics = req.file;
  console.log(profilePics);

  const updateData = {
    hasCompletedOnboarding: true,
    applicant: {},
  };

  if (bio) updateData.applicant.bio = bio;
  if (interests) updateData.applicant.interests = JSON.parse(interests);
  if (website) updateData.applicant.website = website;

  if (profilePics) {
    updateData.applicant.profilePics = {
      picsname: profilePics.originalname,
      cloudinary_id: profilePics.filename,
      url: profilePics.path,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(applicantId, updateData, {
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

const AppError = require("../utils/appError");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const logoUpload = require("./../utils/logoUpload");

exports.uploadLogo = logoUpload.single("logo");

exports.uploadProfilePics = logoUpload.single("profilePics");

exports.onboardRecruiter = catchAsync(async (req, res, next) => {
  const recruiterId = req.user.id;

  const existingUser = await User.findById(recruiterId);
  if (existingUser.company?.hasCompletedOnboarding) {
    return next(new AppError("You have already completed onboarding", 400));
  }

  if (!req.body && !req.file) {
    return next(
      new AppError(
        "Please fill at least one field before completing onboarding",
        400
      )
    );
  }

  const { companyName, industry, website } = req.body;
  const logo = req.file;
  console.log(logo);

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

exports.onboardApplicant = catchAsync(async (req, res, next) => {
  const applicantId = req.user.id;

  const existingUser = await User.findById(applicantId);
  if (existingUser.applicant?.hasCompletedOnboarding) {
    return next(new AppError("You have already completed onboarding", 400));
  }

  if (!req.body && !req.file) {
    return next(
      new AppError(
        "Please fill at least one field before completing onboarding",
        400
      )
    );
  }

  const { bio, interest, website } = req.body;
  const profilePics = req.file;
  console.log(profilePics);

  const updateData = {
    applicant: {
      hasCompletedOnboarding: true,
    },
  };

  if (bio) updateData.applicant.bio = bio;
  if (interest) updateData.applicant.interest = interest;
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

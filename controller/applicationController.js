const {
  cloudinary,
  uploadToCloudinary,
  cleanupCloudinaryFile,
} = require("./../config/cloudinary");
const Application = require("./../model/applicationModel");
const resumeUpload = require("./../utils/resumeUpload");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const getExtractedText = require(".././utils/extractText");

exports.uploadResume = resumeUpload.single("resume");

checkExistingApplication = async (jobId, applicantId, next) => {
  const existingApplication = await Application.findOne({
    jobId,
    applicantId,
  });

  if (existingApplication) {
    return next(new AppError("You already applied to this job", 400));
  }
};

validateFileUpload = (file, next) => {
  if (!file) {
    throw next(new AppError("You have to upload your resume", 400));
  }
};

extractResumeText = async (file, next) => {
  try {
    const text = await getExtractedText(file);
    if (!text || text.trim().length < 10) {
      throw next(
        new AppError(
          "The uploaded resume appears to be empty or contains insufficient text. Please upload a resume with readable content.",
          400
        )
      );
    }
    return text;
  } catch (err) {
    const message = err.message.includes("Failed to extract text")
      ? err.message
      : `Unable to process your resume: ${err.message}`;
    throw next(new AppError(message, 400));
  }
};

exports.createApplication = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const applicantId = req.user.id;
  const file = req.file;

  try {
    await checkExistingApplication(jobId, applicantId);
    validateFileUpload(file);

    const extractedText = await extractResumeText(file);
    const cloudinaryResult = await uploadToCloudinary(file);

    const newApplication = await Application.create({
      jobId,
      applicantId,
      resume: {
        filename: file.originalname,
        url: cloudinaryResult.secure_url,
        mimetype: file.mimetype,
        size: file.size,
        cloudinary_id: cloudinaryResult.public_id,
      },
      extractedText,
    });

    req.job.noOfApplications++;
    await req.job.save();

    res.status(201).json({
      status: "success",
      data: { application: newApplication },
    });
  } catch (error) {
    if (error instanceof AppError) return next(error);

    // Clean up if something failed after upload
    if (error && error.public_id) {
      await cleanupCloudinaryFile(error.public_id);
    }
    next(error);
  }
});

exports.getAllApplications = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;

  const applications = await Application.find({ jobId })
    .populate("applicantId", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    status: "success",
    result: applications.length,
    data: {
      applications,
    },
  });
});

exports.getMyApplications = catchAsync(async (req, res, next) => {
  const applications = await Application.find({ applicantId: req.user.id })
    .populate("jobId", "title company location jobStatus")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    status: "success",
    result: applications.length,
    data: {
      applications,
    },
  });
});

exports.getApplicationById = catchAsync(async (req, res, next) => {
  const { applicationId } = req.params;

  const application = await Application.findById(applicationId)
    .populate("applicantId", "name email")
    .populate("jobId", "title company");

  if (!application) {
    return next(new AppError("Application not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      application: application,
    },
  });
});

exports.deleteApplication = catchAsync(async (req, res, next) => {
  const application = req.application;

  if (application.resume && application.resume.cloudinary_id) {
    try {
      await cloudinary.uploader.destroy(application.resume.cloudinary_id, {
        resource_type: "raw",
      });
      console.log(
        "File deleted from Cloudinary:",
        application.resume.cloudinary_id
      );
    } catch (error) {
      console.error("Failed to delete file from Cloudinary:", error);
    }
  }
  await Application.findByIdAndDelete(req.params.applicationId);
  res.status(204).json({
    status: "success",
    message: null,
  });
});

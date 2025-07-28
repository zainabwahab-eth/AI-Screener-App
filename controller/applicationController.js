const axios = require("axios");
const pdfparse = require("pdf-parse");
const mammoth = require("mammoth");
const cloudinary = require("./../config/cloudinary");
const Application = require("./../model/applicationModel");
const resumeUpload = require("./../utils/resumeUpload");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getExtractedText = async (file) => {
  let extractedText = "";

  try {
    if (file.mimetype === "application/pdf") {
      const response = await axios({
        method: "GET",
        url: file.path,
        responseType: "arraybuffer",
      });
      const data = await pdfparse(Buffer.from(response.data));
      extractedText = data.text;
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const response = await axios({
        method: "GET",
        url: file.path,
        responseType: "arraybuffer",
      });
      const result = await mammoth.extractRawText({
        buffer: Buffer.from(response.data),
      });
      extractedText = result.value;
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    return extractedText;
  } catch (error) {
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
};

exports.uploadResume = resumeUpload.single("resume");

exports.createApplication = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const applicantId = req.user.id;

  const existingApplication = await Application.findOne({
    jobId,
    applicantId,
  });
  if (existingApplication) {
    return next(new AppError("You already applied to this job", 400));
  }

  const file = req.file;
  if (!file) {
    return next(new AppError("You have to upload your resume", 400));
  }

  const extractedText = await getExtractedText(file);

  if (!extractedText || extractedText.trim().length === 0) {
    try {
      await cloudinary.uploader.destroy(file.filename, {
        resource_type: "raw",
      });
    } catch (cleanupError) {
      console.error(
        "Failed to cleanup file after text extraction failure:",
        cleanupError
      );
    }

    return next(
      new AppError(
        "Could not extract text from the resume. Please ensure the file is readable and not corrupted.",
        400
      )
    );
  }

  const newApplication = await Application.create({
    jobId,
    applicantId,
    resume: {
      filename: file.originalname,
      url: file.path, // This will be the Cloudinary URL
      mimetype: file.mimetype,
      size: file.size,
      cloudinary_id: file.filename, // Cloudinary public ID
    },
    extractedText,
  });

  const job = req.job;
  job.noOfApplications++;
  await job.save();

  res.status(201).json({
    status: "success",
    data: {
      application: newApplication,
    },
  });
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
    .populate("jobId", "title company")
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

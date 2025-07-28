const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Job = require("./../model/jobModel");
const Application = require("./../model/applicationModel");
const aiAnalyzeResume = require("./../utils/analyzeResume");

exports.screenApplications = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId;

  const applications = await Application.find({ jobId }).populate(
    "applicantId",
    "name email"
  );

  const results = [];
  const errors = [];

  for (let i = 0; i < applications.length; i++) {
    const app = applications[i];
    try {
      if (!app.extractedText) {
        errors.push({ id: app._id, error: "No resume text" });
        continue;
      }

      const aiResult = await aiAnalyzeResume(
        job.requirements || "Not specified",
        job.description || "Not specified",
        app.extractedText
      );

      // Update application
      app.aiScore = aiResult.score;
      app.aiFeedback = aiResult.feedback;
      app.lastScreenedAt = new Date();
      await app.save();

      results.push(app.toObject());

      // Rate limiting delay (3 requests/sec max)
      if (i < applications.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    } catch (error) {
      errors.push({ id: app._id, error: error.message });
      continue;
    }
  }

  // Sort by score (highest first)
  results.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

  res.status(200).json({
    status: "success",
    results: results.length,
    data: results,
    ...(errors.length > 0 && { errors }),
  });
});

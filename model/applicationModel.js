const mongoose = require("mongoose");

const applicationSchema = mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    filename: String,
    url: String,
    mimeType: String,
    size: String,
    cloudinary_id: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now(),
  },
  extractedText: String,
  aiScore: Number,
  aiFeedback: String,
  lastScreenedAt: Date,
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;

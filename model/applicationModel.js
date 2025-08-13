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
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    cloudinary_id: { type: String, required: true },
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

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Jon must have a title"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Job must habe a description"],
    },
    role: {
      type: String,
      required: [true, "Job must have role"],
    },
    company: String,
    location: String,
    industry: String,
    experience: {
      type: String,
      enum: ["entry-level", "beginner", "junior", "senior", "associate"],
      default: junior,
    },
    jobStatus: {
      type: String,
      enum: ["active", "inacive"],
      default: active,
    },
    noOfApplication: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

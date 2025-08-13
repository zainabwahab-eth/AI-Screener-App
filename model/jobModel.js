const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "job must have a title"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Job must have a description"],
    },
    requirements: {
      type: String,
      required: [true, "Job must have requirements"],
    },
    role: {
      type: String,
      required: [true, "Job must have role"],
    },
    location: String,
    experience: {
      type: String,
      enum: ["entry-level", "beginner", "mid-level", "senior", "associate"],
      default: "mid-level",
    },
    jobStatus: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
    minSalary: {
      type: Number,
    },
    maxSalary: {
      type: Number,
    },
    locationType: {
      type: String,
      enum: ["remote", "on-site", "hybrid"],
      default: "remote",
    },
    noOfApplications: {
      type: Number,
      default: 0,
    },
    expiringDate: {
      type: Date,
    },
    tags: [String],
  },
  { timestamps: true }
);

// jobSchema.pre(/^find/, function (next) {
//   this.find({ jobStatus: { $ne: "inactive" } });
//   next();
// });

jobSchema.index({ minSalary: 1});
jobSchema.index({ maxSalary: -1 });
jobSchema.index({ experience: 1 });
jobSchema.index({ locationType: 1 });
jobSchema.index({ title: 'text', description: 'text', tags: 'text' });

jobSchema.pre(/^find/, function (next) {
  this.populate({
    path: "recruiterId",
    select: "name company.name company.logo company.website",
  });
  next();
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

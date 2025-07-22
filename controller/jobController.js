const AppError = require("../utils/appError");
const Job = require("./../model/jobModel");
const catchAsync = require("./../utils/catchAsync");
const JobSearch = require("./../utils/jobSearch");

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const search = new JobSearch(Job.find({ jobStatus: "active" }), req.query)
    .filter()
    .sort()
    .paginate();

  const jobs = await search.query;

  return res.status(200).json({
    status: "success",
    result: jobs.length,
    data: {
      job: jobs,
    },
  });
});

exports.getMyJobs = catchAsync(async (req, res, next) => {
  const recruiterId = req.user.id;

  const myJobs = await Job.find({ recruiterId });

  return res.status(200).json({
    status: "success",
    data: {
      job: myJobs,
    },
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) {
    return next(new AppError("This job does not exist", 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create({ ...req.body, recruiterId: req.user.id });

  return res.status(201).json({
    status: "success",
    data: {
      job: newJob,
    },
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(201).json({
    status: "success",
    data: {
      job: updatedJob,
    },
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  await req.job.deleteOne();
  res.status(204).json({
    status: "success",
    message: null,
  });
});

exports.changeStatus = catchAsync(async (req, res, next) => {
  const jobStatus = req.job.jobStatus === "active" ? "inactive" : "active";
  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    { jobStatus },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(201).json({
    status: "success",
    data: {
      job: updatedJob,
    },
  });
});

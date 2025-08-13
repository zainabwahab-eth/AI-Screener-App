const AppError = require("../utils/appError");
const Job = require("./../model/jobModel");
const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const JobSearch = require("./../utils/jobSearch");

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const search = new JobSearch(Job.find(), req.query)
    .filter()
    .searchByKeyword()
    .sort()
    .limitFields()
    .paginate();

  // const jobs = await search.query.explain("executionStats");
  const jobs = await search.query;

  return res.status(200).json({
    status: "success",
    result: jobs.length,
    data: {
      jobs,
    },
  });
});

exports.getMyFavoriteJobs = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("favoriteJobs");

  // Create a query restricted to only favorite jobs
  const search = new JobSearch(
    Job.find({ _id: { $in: user.favoriteJobs } }),
    req.query
  )
    .filter()
    .searchByKeyword()
    .sort()
    .limitFields()
    .paginate();

  const jobs = await search.query;
  // const jobs = await search.query.explain("executionStats");

  res.status(200).json({
    status: "success",
    results: jobs.length,
    data: {
      jobs,
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
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
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
  const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
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

exports.toggleFavourite = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId;
  const applicantId = req.user.id;

  const user = await User.findById(applicantId);

  const jobIndex = user.favoriteJobs.indexOf(jobId);

  let action;
  if (jobIndex === -1) {
    user.favoriteJobs.push(jobId);
    action = "added";
  } else {
    user.favoriteJobs.pull(jobId);
    action = "removed";
  }

  await user.save();

  res.status(200).json({
    status: "success",
    message: `Job ${action} to favorites`,
    data: {
      favoriteJobs: user.favoriteJobs,
    },
  });
});

exports.changeStatus = catchAsync(async (req, res, next) => {
  const jobStatus = req.job.jobStatus === "active" ? "inactive" : "active";
  const updatedJob = await Job.findByIdAndUpdate(
    req.params.jobId,
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

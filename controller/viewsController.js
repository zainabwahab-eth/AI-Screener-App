const catchAsync = require("../utils/catchAsync");
const Job = require("./../model/jobModel");
const User = require("./../model/userModel");
const Application = require("./../model/applicationModel");
const JobSearch = require("./../utils/jobSearch");
const formatJobDate = require("./../utils/formatJobDate");
const optimizeImages = require("./../utils/optimizeImage");

exports.getJobs = catchAsync(async (req, res, next) => {
  const search = new JobSearch(Job.find(), req.query)
    .filter()
    .searchByKeyword()
    .sort()
    .limitFields()
    .paginate();

  const jobs = await search.query;
  const optimizedJobs = optimizeImages(jobs);

  res.status(200).render("overview", {
    title: "All Jobs",
    page: "jobs",
    // jobs: optimizedJobs,
    jobs,
    formatJobDate,
  });
});

exports.getFavouritePage = catchAsync(async (req, res, next) => {
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

  res.status(200).render("favourite", {
    title: "My favourite jobs",
    page: "favorites",
    jobs,
    formatJobDate,
  });
});

exports.getSignUpPage = (req, res) => {
  const authType = "signup";
  res.status(200).render("auth", {
    title: authType === "signup" ? "Sign up" : "Login",
    authType,
  });
};

exports.getLoginPage = (req, res) => {
  const authType = "login";
  res.status(200).render("auth", {
    title: authType === "signup" ? "Sign up" : "Login",
    authType,
  });
};

exports.getRolesPage = (req, res) => {
  res.status(200).render("roles", {
    title: "Select your role",
  });
};

exports.getOnboardPage = (req, res) => {
  res.status(200).render("onboarding", {
    title: "User Onboarding",
  });
};

exports.getJobDetailsPage = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  let application = {};
  let applied = false;
  if (res.locals.user) {
    application = await Application.findOne({
      jobId: req.params.jobId,
      applicantId: res.locals.user.id,
    }).select("resume");
    applied = !!application;
  }

  console.log("resume:", application);
  console.log(applied);

  res.status(200).render("jobdetails", {
    title: `${job.title} Job`,
    job,
    formatJobDate,
    application,
    applied,
  });
};

exports.getApplicationPage = async (req, res) => {
  const applications = await Application.find({ applicantId: req.user.id })
    .populate("jobId", "title company location jobStatus createdAt")
    .sort({ createdAt: -1 });

  res.status(200).render("applications", {
    title: "My applications",
    applications,
    formatJobDate,
    page: "applications",
  });
};

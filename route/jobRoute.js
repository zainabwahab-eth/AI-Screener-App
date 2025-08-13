const express = require("express");
const authMiddleware = require("./../middleware/authMiddleware");
const jobController = require("./../controller/jobController");

const router = express.Router();

//Apllicant
router.route("/").get(jobController.getAllJobs);

router.get(
  "/my-favorites",
  authMiddleware.validateUser,
  authMiddleware.restrictTo("applicant"),
  jobController.getMyFavoriteJobs
);

router.route("/:jobId").get(jobController.getJob);

router.use(authMiddleware.validateUser);

//Applicant
// router.get(
//   "/my-Favourite",
//   authMiddleware.restrictTo("applicant"),
//   jobController.getFavouriteJobs
// );

router
  .route("/favourite/:jobId")
  .patch(
    authMiddleware.restrictTo("applicant"),
    authMiddleware.checkJob,
    jobController.toggleFavourite
  );

//Recruiter
router
  .route("/recruiter/jobs")
  .get(authMiddleware.restrictTo("recruiter"), jobController.getMyJobs)
  .post(authMiddleware.restrictTo("recruiter"), jobController.createJob);

router
  .route("/recruiter/job/:jobId/status")
  .patch(
    authMiddleware.restrictTo("recruiter"),
    authMiddleware.checkRecruiter,
    jobController.changeStatus
  );

router
  .route("/recruiter/job/:jobId")
  .patch(
    authMiddleware.restrictTo("recruiter"),
    authMiddleware.checkRecruiter,
    jobController.updateJob
  )
  .delete(
    authMiddleware.restrictTo("recruiter"),
    authMiddleware.checkRecruiter,
    jobController.deleteJob
  );

module.exports = router;

const express = require("express");
const authMiddleware = require("./../middleware/authMiddleware");
const jobController = require("./../controller/jobController");

const router = express.Router();

//Apllicant
router.route("/").get(jobController.getAllJobs);
router.route("/:id").get(jobController.getJob);

//Recruiter
router.use(authMiddleware.validateUser);

router
  .route("/recruiter/jobs")
  .get(authMiddleware.restrictTo("recruiter"), jobController.getMyJobs)
  .post(authMiddleware.restrictTo("recruiter"), jobController.createJob);

router
  .route("/recruiter/job/:id/status")
  .patch(
    authMiddleware.restrictTo("recruiter"),
    authMiddleware.checkRecruiter,
    jobController.changeStatus
  );

router
  .route("/recruiter/job/:id")
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

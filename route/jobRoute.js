const express = require("express");
const authMiddleware = require("./../middleware/authMiddleware");
const jobController = require("./../controller/jobController");

const router = express.Router();

router.route("/").get(jobController.getAllJobs);
router.route("/:id").get(jobController.getJob);

router.use(authMiddleware.validateUser);

router
  .route("/recruiter/jobs")
  .get(authMiddleware.restrictTo("recruiter"), jobController.getMyJobs)
  .post(authMiddleware.restrictTo("recruiter"), jobController.createJob);

router
  .route("/recruiter/job/:id/status")
  .patch(
    authMiddleware.restrictTo("recruiter"),
    authMiddleware.checkOwnership,
    jobController.changeStatus
  );

router
  .route("/recruiter/job/:id")
  .patch(
    authMiddleware.restrictTo("recruiter"),
    authMiddleware.checkOwnership,
    jobController.updateJob
  )
  .delete(
    authMiddleware.restrictTo("recruiter"),
    authMiddleware.checkOwnership,
    jobController.deleteJob
  );

module.exports = router;

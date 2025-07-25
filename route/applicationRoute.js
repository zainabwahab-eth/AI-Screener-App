const express = require("express");
const authMiddleware = require("./../middleware/authMiddleware");
const applicationController = require("./../controller/applicationController");
// const resumeUpload = require("./../utils/resumeUpload");

const router = express.Router();

router.use(authMiddleware.validateUser);

//Applicant only
router.get(
  "/myApplications",
  authMiddleware.restrictTo("applicant"),
  applicationController.getMyApplications
);

router.post(
  "/:jobId/apply",
  authMiddleware.restrictTo("applicant"),
  // resumeUpload.single("resume"),
  applicationController.uploadResume,
  applicationController.createApplication
);

router.delete(
  "/:applicationId",
  authMiddleware.restrictTo("applicant"),
  authMiddleware.checkApplicant,
  applicationController.deleteApplication
);

// Recruiter only
router.get(
  "/:jobId/applications",
  authMiddleware.restrictTo("recruiter"),
  applicationController.getAllApplications
);

//Shared
router.get(
  "/:applicationId",
  authMiddleware.restrictTo("applicant", "recruiter"),
  applicationController.getApplicationById
);

module.exports = router;

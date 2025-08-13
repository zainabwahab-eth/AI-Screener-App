const express = require("express");
const authMiddleware = require("./../middleware/authMiddleware");
const applicationController = require("./../controller/applicationController");
const aiController = require("./../controller/aiController");

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
  authMiddleware.checkJob,
  applicationController.uploadResume,
  applicationController.createApplication
);

router.get(
  "/:jobId/screen",
  authMiddleware.restrictTo("recruiter"),
  authMiddleware.checkRecruiter,
  aiController.screenApplications
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
  authMiddleware.checkJob,
  applicationController.getAllApplications
);

//Shared
router.get(
  "/:applicationId",
  authMiddleware.restrictTo("applicant", "recruiter"),
  applicationController.getApplicationById
);

// router.get(
//   "/:applicationId/preview",
//   authMiddleware.validateUser,
//   authMiddleware.restrictTo("applicant", "recruiter"),
//   applicationController.getResumePreview
// );

module.exports = router;

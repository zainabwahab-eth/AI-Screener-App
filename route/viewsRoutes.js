const express = require("express");
const viewController = require("../controller/viewsController");
const authMiddleware = require(".././middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware.isLoggedIn, viewController.getJobs);
router.get("/signUp", authMiddleware.isLoggedIn, viewController.getSignUpPage);
router.get("/roles", authMiddleware.isLoggedIn, viewController.getRolesPage);
router.get("/login", authMiddleware.isLoggedIn, viewController.getLoginPage);
router.get(
  "/user-onboard",
  authMiddleware.isLoggedIn,
  viewController.getOnboardPage
);
router.get(
  "/favorites",
  authMiddleware.isLoggedIn,
  authMiddleware.validateUser,
  authMiddleware.restrictTo("applicant"),
  viewController.getFavouritePage
);

router.get(
  "/job/:jobId",
  authMiddleware.isLoggedIn,
  viewController.getJobDetailsPage
);

router.get(
  "/applications",
  authMiddleware.isLoggedIn,
  authMiddleware.validateUser,
  authMiddleware.restrictTo("applicant"),
  viewController.getApplicationPage
);

// router.get(
//   "/:applicationId/preview",
//   authMiddleware.validateUser,
//   authMiddleware.restrictTo("applicant", "recruiter"),
//   viewController.previewResume
// );

module.exports = router;

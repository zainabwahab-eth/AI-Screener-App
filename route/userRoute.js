const express = require("express");
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");
const authMiddleware = require("./../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.use(authMiddleware.validateUser);

router.post(
  "/recruiter/onboard",
  authMiddleware.restrictTo("recruiter"),
  userController.uploadLogo,
  userController.onboardRecruiter
);

router.post(
  "/applicant/onboard",
  authMiddleware.restrictTo("applicant"),
  userController.uploadProfilePics,
  userController.onboardApplicant
);

module.exports = router;

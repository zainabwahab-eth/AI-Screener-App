const express = require("express");
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");
const authMiddleware = require("./../middleware/authMiddleware");

const router = express.Router();

// router.post("/user/role", userController.selectRole);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use(authMiddleware.validateUser);

router.patch(
  "/recruiter/onboard",
  authMiddleware.restrictTo("recruiter"),
  userController.uploadLogo,
  userController.onboardRecruiter
);

router.patch(
  "/applicant/onboard",
  authMiddleware.restrictTo("applicant"),
  userController.uploadProfilePics,
  userController.onboardApplicant
);

module.exports = router;

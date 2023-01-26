const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getHomePage);
router.get("/forgetPassword", viewsController.forgetPassword);
router.get("/overview", authController.isLoggedIn, viewsController.getOverview);
router.get(
  "/property/:slug",
  authController.isLoggedIn,
  viewsController.getProperty
);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get(
  "/signup",
  authController.isLoggedIn,
  viewsController.getRegistrationPage
);
router.get("/me", authController.protect, viewsController.getAccount);
router.get("/bidding", authController.protect, viewsController.getBiddings);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);
router.get(
  "/createProperty",
  authController.protect,
  viewsController.getCreatePropertyPage
);

module.exports = router;

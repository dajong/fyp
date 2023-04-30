const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);
router.post(
  "/addAdmin",
  authController.restrictTo("admin"),
  authController.addNewAdmin
);
router.patch("/addFavouriteProperty", userController.addFavoriteProperty);
router.patch("/removeFavouriteProperty", userController.removeFavoriteProperty);

router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.post("/placeBid", userController.placeBid);
router.post("/removeBidding", userController.removeBidding);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

module.exports = router;

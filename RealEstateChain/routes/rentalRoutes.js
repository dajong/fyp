const express = require("express");
const rentalController = require("../controllers/rentalController");
const propertyController = require("../controllers/propertyController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/createRentalProperty",
  authController.protect,
  propertyController.uploadImageCover,
  propertyController.resizeImageCover,
  rentalController.createRentalProperty
);

router.route("/addContract").post(rentalController.addContract);

router
  .route("/applyForRental")
  .post(authController.protect, rentalController.applyForRental);

router
  .route("/withdrawApplication")
  .post(authController.protect, rentalController.removeRentalApplication);

router
  .route("/approveRental")
  .post(authController.protect, rentalController.approveRental);

router
  .route("/updateRentalProperty/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    rentalController.updateRentalProperty
  );

router
  .route("/rentProperty")
  .post(authController.protect, rentalController.rentProperty);

router.route("/:id").get(authController.protect, rentalController.getProperty);

router.route("/payRent").post(authController.protect, rentalController.payRent);

router
  .route("/endRentalContract")
  .post(authController.protect, rentalController.endRentalContract);

router
  .route("/renewRentalContract")
  .post(authController.protect, rentalController.renewRentalContract);

// Add more routes for rentProperty, payRent, endRental, and withdrawSecurityDeposit
// router
//   .route("/")
//   .get(rentalController.getAllRentalProperties)
//   .post(
//     authController.protect,
//     authController.restrictTo("admin"),
//     rentalController.createRentalProperty
//   );

// router
//   .route("/:id")
//   .get(rentalController.getRentalProperty)
//   .patch(
//     authController.protect,
//     authController.restrictTo("admin"),
//     rentalController.updateRentalProperty
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo("admin"),
//     rentalController.deleteRentalProperty
//   );

// router.post("/:id/rent", authController.protect, rentalController.rentProperty);
// router.post("/:id/payRent", authController.protect, rentalController.payRent);
// router.post(
//   "/:id/endRental",
//   authController.protect,
//   rentalController.endRental
// );
// router.post(
//   "/:id/withdrawSecurityDeposit",
//   authController.protect,
//   rentalController.withdrawSecurityDeposit
// );

module.exports = router;

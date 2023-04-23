const express = require("express");
const rentalController = require("../controllers/rentalController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/createRentalProperty",
  authController.protect,
  rentalController.createRentalProperty
);

router.route("/addContract").post(rentalController.addContract);

router
  .route("/applyForRental")
  .post(authController.protect, rentalController.applyForRental);

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

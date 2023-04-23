const express = require("express");
const rentalController = require("../controllers/rentalController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/createRentalProperty",
  authController.protect,
  rentalController.createRentalProperty
);
// Add more routes for rentProperty, payRent, endRental, and withdrawSecurityDeposit

module.exports = router;

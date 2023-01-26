const express = require("express");
const propertyController = require("../controllers/propertyController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    propertyController.createProperty
  );

router.route("/addContract").post(propertyController.addContract);
router
  .route("/soldProperty")
  .post(authController.protect, propertyController.soldProperty);
router
  .route("/placeBid")
  .post(authController.protect, propertyController.placeBid);

router
  .route("/:id")
  .get(propertyController.getProperty)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    propertyController.updateProperty
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    propertyController.deleteProperty
  );

module.exports = router;

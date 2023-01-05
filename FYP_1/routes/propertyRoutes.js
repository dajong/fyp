const express = require("express");
const propertyController = require("./../controllers/propertyController");
const authController = require("./../controllers/authController");

const router = express.Router();

// router.param('id', tourController.checkID);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

// router
//   .route("/top-5-cheap")
//   .get(tourController.aliasTopTours, tourController.getAllTours);

// router.route("/tour-stats").get(tourController.getTourStats);
// router
//   .route("/monthly-plan/:year")
//   .get(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide", "guide"),
//     tourController.getMonthlyPlan
//   );

// router
//   .route("/tours-within/:distance/center/:latlng/unit/:unit")
//   .get(tourController.getToursWithin);
// // /tours-within?distance=233&center=-40,45&unit=mi
// // /tours-within/233/center/-40,45/unit/mi

// router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(
    //authController.protect,
    //authController.restrictTo("admin"),
    propertyController.createProperty
  );

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

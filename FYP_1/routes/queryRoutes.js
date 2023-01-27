const express = require("express");
const queryController = require("../controllers/queryController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").post(queryController.createQuery);
router
  .route("/replyQuery")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    queryController.replyQuery
  );

module.exports = router;

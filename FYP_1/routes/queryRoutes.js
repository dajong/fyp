const express = require("express");
const queryController = require("../controllers/queryController");

const router = express.Router();

router.route("/").post(queryController.createQuery);

module.exports = router;

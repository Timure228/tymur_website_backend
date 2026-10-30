const express = require("express");
const controller = require("../controllers/feedbackController");

const router = express.Router();
router.post("/", controller.createFeedback);

module.exports = router;
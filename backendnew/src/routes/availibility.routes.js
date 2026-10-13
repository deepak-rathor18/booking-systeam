const express = require("express");
const router = express.Router();
const { getAvailability } = require("../controllers/avabilability.controller");

router.get("/", getAvailability);

module.exports = router;

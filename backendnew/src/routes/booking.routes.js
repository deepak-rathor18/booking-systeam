const express = require("express");
const router = express.Router();
const {getbooking, createBooking, updateBooking, deleteBooking} = require("../controllers/booking.controller");

router.get("/", getbooking);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);


module.exports = { router };

const express = require("express");
const router = express.Router();
const bookingController = require("../../controller/api/booking.js");
const { isLoggedInAPI, isVerifiedAPI } = require("../../middleware/middleware.js");

router.post("/create-order", isLoggedInAPI, isVerifiedAPI, bookingController.createBookingOrder);
router.post("/verify-payment", isLoggedInAPI, isVerifiedAPI, bookingController.verifyPayment);
router.get("/my-bookings", isLoggedInAPI, bookingController.getUserBookings);

module.exports = router;

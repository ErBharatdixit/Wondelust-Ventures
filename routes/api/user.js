const express = require("express");
const router = express.Router();
const userApiController = require("../../controller/api/user.js");
const passport = require("passport");
const { isLoggedInAPI } = require("../../middleware/middleware.js");

router.post("/signup", userApiController.signup);
router.post("/verify-otp", userApiController.verifyOTP);
router.post("/resend-otp", userApiController.resendOTP);

router.post("/login", passport.authenticate("local"), userApiController.login);

router.get("/logout", userApiController.logout);

router.get("/current_user", userApiController.currentUser);

const multer = require('multer');
const { storage } = require("../../cloudConfig.js");
const upload = multer({ storage });

// Profile routes
router.get("/users/:id", userApiController.getProfile);
router.get("/users/:id/listings", userApiController.getUserListings);
router.get("/users/:id/reviews", userApiController.getUserReviews);
router.put("/users/:id", isLoggedInAPI, upload.single('profilePicture'), userApiController.updateProfile);

// Favorites routes
router.post("/favorites/:listingId", isLoggedInAPI, userApiController.toggleFavorite);
router.get("/favorites", isLoggedInAPI, userApiController.getFavorites);

module.exports = router;

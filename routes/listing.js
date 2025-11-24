const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isVerified, isOwner, validateListing } = require("../middleware/middleware.js");
const listingController = require("../controller/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// New Route
router.get("/new", isLoggedIn, isVerified, listingController.renderNewForm);

router.route("/")
  .get(listingController.index)
  .post(isLoggedIn, isVerified, upload.array("listing[images]", 5), validateListing, listingController.createNewListing);

router.route("/:id")
  .get(listingController.showDetail)
  .put(isLoggedIn, isVerified, isOwner, upload.array("listing[images]", 5), validateListing, listingController.updateListing)
  .delete(isLoggedIn, isVerified, isOwner, listingController.deleteListing);

// Edit route
router.get("/:id/edit", isLoggedIn, isVerified, isOwner, listingController.EditListing);

module.exports = router;
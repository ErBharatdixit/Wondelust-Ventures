const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");  
const Review = require("../models/review.js");  
const { isLoggedIn } = require("../middleware/middleware.js")
const { isOwner, saveRedirectUrls } = require("../middleware/middleware.js")
const listingController = require("../controller/listing.js")

// index route
  router.get("/", listingController.index) 
// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm); 




// show route
router.get("/:id", listingController.showDetail);
// create Route

router.post("/", isLoggedIn,listingController.createNewListing )

// Edit route

router.get("/:id/edit", isLoggedIn,isOwner,listingController.EditListing);
// update route

router.put("/:id", isLoggedIn,isOwner,listingController.updateListing)
// Delete Route
router.delete("/:id", isLoggedIn, isOwner, listingController.DeleteListing)


module.exports = router;
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");  
const Review = require("../models/review.js");  
const { isLoggedIn } = require("../middleware/middleware.js")
const { isOwner, saveRedirectUrls } = require("../middleware/middleware.js")
const listingController = require("../controller/listing.js")

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm); 

 router.route("/")
  .get( listingController.index) 
   .post( isLoggedIn, listingController.createNewListing)

   router.route("/:id")
     .get( listingController.showDetail)
     .put( isLoggedIn, isOwner, listingController.updateListing)
     .delete( isLoggedIn, isOwner, listingController.DeleteListing)







// Edit route

router.get("/:id/edit", isLoggedIn,isOwner,listingController.EditListing);




module.exports = router;
const express = require("express");
const router = express.Router();
const listingApiController = require("../../controller/api/listing.js");

// Middleware to check if user is logged in
// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
      if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "You must be logged in" });
      }
      next();
};

// Middleware to check ownership (simplified for API)
const isOwner = async (req, res, next) => {
      const { id } = req.params;
      const listing = await require("../../models/listing").findById(id);

      // Allow if user is admin OR if user is the owner
      if (req.user.isAdmin || listing.owner.equals(req.user._id)) {
            return next();
      }

      return res.status(403).json({ message: "You are not the owner of this listing" });
};

const multer = require('multer');
const { storage } = require('../../cloudConfig.js');
const upload = multer({ storage });

router.get("/trending", listingApiController.trending);

router.route("/")
      .get(listingApiController.index)
      .post(isLoggedIn, upload.array('images'), listingApiController.createNewListing);

router.post("/:id/like", isLoggedIn, listingApiController.toggleLike);

router.route("/:id")
      .get(listingApiController.showDetail)
      .put(isLoggedIn, isOwner, upload.array('images'), listingApiController.updateListing)
      .delete(isLoggedIn, isOwner, listingApiController.deleteListing);

module.exports = router;

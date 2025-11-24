const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

// For traditional routes (redirects to login page)
module.exports.isLoggedIn = (req, res, next) => {
      if (!req.isAuthenticated()) {
            //req.session.redirectUrl = req.originalUrl;
            req.flash("error", "you must be logged in to create listings!");
            return res.redirect("/login");
      }
      next();
}

// For API routes (returns JSON error)
module.exports.isLoggedInAPI = (req, res, next) => {
      if (!req.isAuthenticated()) {
            return res.status(401).json({ error: "You must be logged in" });
      }
      next();
}

// Check if user's email is verified (for API routes)
module.exports.isVerifiedAPI = (req, res, next) => {
      if (!req.user.isVerified) {
            return res.status(403).json({
                  error: "Please verify your email address to access this feature",
                  needsVerification: true
            });
      }
      next();
}

// Check if user's email is verified (for traditional routes)
module.exports.isVerified = (req, res, next) => {
      if (!req.user.isVerified) {
            req.flash("error", "Please verify your email address to access this feature");
            return res.redirect("/verification-pending");
      }
      next();
}

module.exports.isOwner = async (req, res, next) => {
      let { id } = req.params;
      let listing = await Listing.findById(id);

      // Ensure the listing is found before proceeding  
      if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect('/listings'); // Redirect to a safe place  
      }

      // Check if the current user is defined and matches the listing owner OR is an admin
      if (!res.locals.currUser || (!listing.owner.equals(res.locals.currUser._id) && !res.locals.currUser.isAdmin)) {
            req.flash("error", "you don't have permission to edit");
            return res.redirect(`/listings/${id}`);
      }

      // If the user is the owner or admin, proceed to the next middleware  
      next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
      let { id, reviewId } = req.params;
      let review = await Review.findById(reviewId);

      // Ensure the listing is found before proceeding  
      if (!review) {
            req.flash("error", "Listing not found");
            return res.redirect('/listings'); // Redirect to a safe place  
      }

      // Check if the current user is defined and matches the listing owner  
      if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "you don't have permission to Delete!");
            return res.redirect(`/listings/${id}`);
      }

      // If the user is the owner, proceed to the next middleware  
      next();
}

module.exports.validateListing = (req, res, next) => {
      let { error } = listingSchema.validate(req.body);
      if (error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
      } else {
            next();
      }
};
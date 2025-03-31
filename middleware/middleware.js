 const Listing = require("../models/listing.js");
 const Review = require("../models/review.js");
module.exports.isLoggedIn = (req, res,next)=>{
      if (!req.isAuthenticated()) {
            //req.session.redirectUrl = req.originalUrl;
            req.flash("error", "you must be logged in to create listings!");
            return res.redirect("/login");
      }
      next();
}

// module.exports.saveRedirectUrls = (req,res,next)=>{
//       if(req.session.redirectUrl){
//             res.locals.redirectUrl = req.session.redirectUrl;
//       }
//       next();
// }
 

module.exports.isOwner = async (req,res,next)=>{
      let {id} = req.params;
       let listing = await Listing.findById(id)

      
      if (!currUser && listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "you don't have permission to edit")
          return  res.redirect(`/listings/${id}`);
      }
}
module.exports.isOwner = async (req, res, next) => {
      let { id } = req.params;
      let listing = await Listing.findById(id);

      // Ensure the listing is found before proceeding  
      if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect('/listings'); // Redirect to a safe place  
      }

      // Check if the current user is defined and matches the listing owner  
      if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "you don't have permission to edit");
            return res.redirect(`/listings/${id}`);
      }

      // If the user is the owner, proceed to the next middleware  
      next();
}  
module.exports.isReviewAuthor = async (req, res, next) => {
      let {id, reviewId} = req.params;
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
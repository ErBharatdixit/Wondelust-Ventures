const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewApiController = require("../../controller/api/review.js");
const { isLoggedInAPI, isVerifiedAPI } = require("../../middleware/middleware.js");

// Middleware to check if user is review author
const isReviewAuthor = async (req, res, next) => {
      const { reviewId } = req.params;
      const review = await require("../../models/review").findById(reviewId);
      if (!review.author.equals(req.user._id)) {
            return res.status(403).json({ message: "You are not the author of this review" });
      }
      next();
};

router.post("/", isLoggedInAPI, isVerifiedAPI, reviewApiController.createReview);
router.put("/:reviewId", isLoggedInAPI, isVerifiedAPI, isReviewAuthor, reviewApiController.updateReview);
router.delete("/:reviewId", isLoggedInAPI, isVerifiedAPI, isReviewAuthor, reviewApiController.deleteReview);

module.exports = router;

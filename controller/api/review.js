const Listing = require("../../models/listing");
const Review = require("../../models/review");

module.exports.createReview = async (req, res) => {
      try {
            const listing = await Listing.findById(req.params.id);
            const newReview = new Review(req.body.review);
            newReview.author = req.user._id;

            listing.reviews.push(newReview);
            await newReview.save();
            await listing.save();

            // Re-fetch to calculate average correctly
            const updatedListing = await Listing.findById(req.params.id).populate('reviews');
            const validReviews = updatedListing.reviews.filter(r => r.rating);
            const avg = validReviews.length > 0 ? validReviews.reduce((acc, r) => acc + r.rating, 0) / validReviews.length : 0;

            updatedListing.averageRating = avg;
            updatedListing.reviewCount = validReviews.length;
            await updatedListing.save();

            // Create notification for host
            if (updatedListing.owner && !updatedListing.owner.equals(req.user._id)) {
                  const notificationController = require('./notification');
                  await notificationController.createNotification(
                        updatedListing.owner,
                        req.user._id,
                        'review',
                        `New review for ${updatedListing.title}`,
                        updatedListing._id
                  );
            }

            res.status(201).json(newReview);
      } catch (err) {
            console.error("Error creating review:", err);
            res.status(400).json({ error: err.message });
      }
};

module.exports.deleteReview = async (req, res) => {
      try {
            const { id, reviewId } = req.params;
            await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
            await Review.findByIdAndDelete(reviewId);

            // Recalculate average
            const listing = await Listing.findById(id).populate('reviews');
            const validReviews = listing.reviews.filter(r => r.rating);
            const avg = validReviews.length > 0 ? validReviews.reduce((acc, r) => acc + r.rating, 0) / validReviews.length : 0;

            listing.averageRating = avg;
            listing.reviewCount = validReviews.length;
            await listing.save();

            res.status(200).json({ message: "Review deleted" });
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

module.exports.updateReview = async (req, res) => {
      try {
            const { reviewId } = req.params;
            const review = await Review.findByIdAndUpdate(reviewId, req.body.review, { new: true });
            res.status(200).json(review);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

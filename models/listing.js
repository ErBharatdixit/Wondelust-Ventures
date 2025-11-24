const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
      title: {
            type: String,
            required: true
      },
      description: {
            type: String,
            required: true
      },
      image: {
            url: String,
            filename: String,
      },
      images: [
            {
                  url: String,
                  filename: String,
            }
      ],
      price: Number,
      location: {
            type: String,
            required: true
      },
      country: {
            type: String,
            required: true
      },
      state: {
            type: String
      },
      reviews: [
            {
                  type: Schema.Types.ObjectId,
                  ref: "Review",
            }
      ],
      owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
      },
      likes: [
            {
                  type: Schema.Types.ObjectId,
                  ref: "User",
            }
      ],
      popularity: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 }
}, {
      timestamps: true
});

listingSchema.post("findOneAndDelete", async (listing) => {
      if (listing) {
            await review.deleteMany({ _id: { $in: listing.reviews } })
      }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
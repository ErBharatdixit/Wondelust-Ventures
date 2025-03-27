const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
      title: {
            type: String
            
      },
      description: String,
            image: {
                  filename: String,
                  url: {
                        type: String,
                        default: "https://images.unsplash.com/photo-1591779051696-1c3fa1469a79"
                  }
            }
,
      price: Number,
      location: String,
      country: String,
      reviews:[
            {
                  type: Schema.Types.ObjectId,
                  ref: "Review",
            }

      ]

      
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;  
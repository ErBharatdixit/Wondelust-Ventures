const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
      recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
      },
      sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
      },
      type: {
            type: String,
            enum: ['booking_request', 'booking_confirmed', 'message', 'review'],
            required: true
      },
      message: {
            type: String,
            required: true
      },
      relatedId: {
            type: Schema.Types.ObjectId, // ID of the related booking, message, etc.
      },
      read: {
            type: Boolean,
            default: false
      }
}, {
      timestamps: true
});

module.exports = mongoose.model("Notification", notificationSchema);

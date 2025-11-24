const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
      email: {
            type: String,
            required: true,
            unique: true
      },
      favorites: [{
            type: Schema.Types.ObjectId,
            ref: 'Listing'
      }],
      profilePicture: {
            url: String,
            filename: String
      },
      bio: {
            type: String,
            default: ""
      },
      isAdmin: {
            type: Boolean,
            default: false
      },
      isVerified: {
            type: Boolean,
            default: false
      },
      verificationOTP: String,
      verificationOTPExpires: Date
})

// Ensure isAdmin is included when converting to JSON
userSchema.set('toJSON', {
      transform: function (doc, ret, options) {
            ret.isAdmin = doc.isAdmin;
            return ret;
      }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
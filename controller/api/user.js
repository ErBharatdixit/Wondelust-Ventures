const User = require("../../models/user");
const Listing = require("../../models/listing");
const Review = require("../../models/review");
const crypto = require('crypto');
const { sendAdminRequestEmail, sendVerificationEmail } = require("../../utils/email");
const { validateEmail } = require("../../utils/emailValidator");

// Existing authentication functions
module.exports.signup = async (req, res) => {
      try {
            const { username, email, password, requestAdmin } = req.body;

            // Validate email before proceeding
            const emailValidation = await validateEmail(email);
            if (!emailValidation.valid) {
                  return res.status(400).json({
                        error: emailValidation.error,
                        suggestion: emailValidation.suggestion
                  });
            }

            const newUser = new User({ email, username });

            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            newUser.verificationOTP = otp;
            newUser.verificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

            const registeredUser = await User.register(newUser, password);

            // Send OTP email
            await sendVerificationEmail(registeredUser, otp);

            if (requestAdmin) {
                  const approvalLink = `${req.protocol}://${req.get('host')}/admin/approve/${registeredUser._id}`;
                  await sendAdminRequestEmail(registeredUser, approvalLink);
            }

            // Don't auto-login, user must verify OTP first
            res.status(201).json({
                  email: registeredUser.email,
                  message: "Registration successful! Please check your email for the verification code."
            });
      } catch (err) {
            res.status(400).json({ error: err.message });
      }
};

module.exports.verifyOTP = async (req, res) => {
      try {
            const { email, otp } = req.body;
            console.log(`🔐 Verifying OTP for ${email}. Received: ${otp}`);

            const user = await User.findOne({ email });

            if (!user) {
                  console.log('❌ User not found');
                  return res.status(404).json({ error: "No account found with that email address." });
            }

            console.log(`👤 User found: ${user.username}, Stored OTP: ${user.verificationOTP}, Expires: ${user.verificationOTPExpires}`);

            if (user.isVerified) {
                  console.log('⚠️ User already verified');
                  return res.status(200).json({ message: "Email is already verified." });
            }

            // Check if OTP is expired
            if (!user.verificationOTPExpires || Date.now() > user.verificationOTPExpires) {
                  console.log('⏰ OTP expired');
                  return res.status(400).json({ error: "OTP has expired. Please request a new one." });
            }

            // Check if OTP matches
            if (user.verificationOTP !== otp) {
                  console.log(`❌ OTP mismatch. Expected: ${user.verificationOTP}, Received: ${otp}`);
                  return res.status(400).json({ error: "Invalid OTP. Please try again." });
            }

            console.log('✅ OTP verified successfully!');

            // OTP is valid - verify user
            user.isVerified = true;
            user.verificationOTP = undefined;
            user.verificationOTPExpires = undefined;
            await user.save();

            // Auto-login the user
            req.login(user, (err) => {
                  if (err) {
                        return res.status(500).json({ error: "Verification successful but login failed." });
                  }
                  res.status(200).json({
                        message: "Email verified successfully!",
                        user: user
                  });
            });

      } catch (e) {
            res.status(500).json({ error: e.message });
      }
};

module.exports.resendOTP = async (req, res) => {
      try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                  return res.status(404).json({ error: "No account found with that email address." });
            }

            if (user.isVerified) {
                  return res.status(200).json({ message: "Email is already verified." });
            }

            // Generate new OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.verificationOTP = otp;
            user.verificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();

            // Send OTP email
            await sendVerificationEmail(user, otp);

            res.status(200).json({ message: "New verification code sent! Please check your email." });
      } catch (e) {
            res.status(500).json({ error: e.message });
      }
};

module.exports.login = async (req, res) => {
      // Check if user is verified
      if (!req.user.isVerified) {
            // Logout the user immediately since passport already logged them in
            req.logout((err) => {
                  if (err) {
                        return res.status(500).json({ error: err.message });
                  }
                  return res.status(403).json({
                        error: "Please verify your email before logging in. Check your inbox for the verification link.",
                        needsVerification: true
                  });
            });
            return;
      }

      res.status(200).json({ user: req.user });
};

module.exports.logout = (req, res) => {
      req.logout((err) => {
            if (err) {
                  return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: "Logged out successfully" });
      });
};

module.exports.currentUser = (req, res) => {
      if (req.user) {
            console.log('Current user from session:', req.user);
            console.log('isAdmin field:', req.user.isAdmin);
            res.status(200).json({ user: req.user });
      } else {
            res.status(401).json({ user: null });
      }
};

// Profile management functions
module.exports.getProfile = async (req, res) => {
      try {
            const { id } = req.params;
            const user = await User.findById(id).select('-password');

            if (!user) {
                  return res.status(404).json({ message: "User not found" });
            }

            // Get user statistics
            const listingsCount = await Listing.countDocuments({ owner: id });
            const reviews = await Review.find({ author: id });
            const reviewsCount = reviews.length;

            // Calculate average rating on user's listings
            const userListings = await Listing.find({ owner: id }).populate('reviews');
            let totalRating = 0;
            let ratingCount = 0;

            userListings.forEach(listing => {
                  listing.reviews.forEach(review => {
                        if (review.rating) {
                              totalRating += review.rating;
                              ratingCount++;
                        }
                  });
            });

            const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

            res.status(200).json({
                  user,
                  stats: {
                        listingsCount,
                        reviewsCount,
                        averageRating
                  }
            });
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

module.exports.getUserListings = async (req, res) => {
      try {
            const { id } = req.params;
            const listings = await Listing.find({ owner: id }).populate('reviews');
            res.status(200).json(listings);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

module.exports.getUserReviews = async (req, res) => {
      try {
            const { id } = req.params;
            const reviews = await Review.find({ author: id }).populate('author');
            res.status(200).json(reviews);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

module.exports.updateProfile = async (req, res) => {
      try {
            const { id } = req.params;

            // Check if user is updating their own profile
            if (req.user._id.toString() !== id) {
                  return res.status(403).json({ message: "Unauthorized" });
            }

            const { username, email, bio } = req.body;
            const updateData = { username, email, bio };

            if (req.file) {
                  updateData.profilePicture = {
                        url: req.file.path,
                        filename: req.file.filename
                  };
            }

            const updatedUser = await User.findByIdAndUpdate(
                  id,
                  updateData,
                  { new: true, runValidators: true }
            ).select('-password');

            res.status(200).json(updatedUser);
      } catch (err) {
            res.status(400).json({ error: err.message });
      }
};

// Favorites functions
module.exports.toggleFavorite = async (req, res) => {
      try {
            const { listingId } = req.params;
            const userId = req.user._id;

            const user = await User.findById(userId);

            if (!user.favorites) {
                  user.favorites = [];
            }

            const index = user.favorites.indexOf(listingId);
            if (index > -1) {
                  user.favorites.splice(index, 1);
            } else {
                  user.favorites.push(listingId);
            }

            await user.save();
            res.status(200).json({ favorites: user.favorites });
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

module.exports.getFavorites = async (req, res) => {
      try {
            const userId = req.user._id;
            const user = await User.findById(userId).populate('favorites');
            res.status(200).json(user.favorites || []);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

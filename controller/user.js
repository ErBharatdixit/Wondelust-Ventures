const User = require("../models/user");
const { sendAdminRequestEmail, sendVerificationEmail } = require("../utils/email");
const { validateEmail } = require("../utils/emailValidator");
const crypto = require("crypto");

module.exports.register = (req, res) => {
      res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
      try {
            let { username, email, password, requestAdmin } = req.body;

            // Validate email before proceeding
            const emailValidation = await validateEmail(email);
            if (!emailValidation.valid) {
                  req.flash("error", emailValidation.error);
                  if (emailValidation.suggestion) {
                        req.flash("info", `Did you mean: ${emailValidation.suggestion}?`);
                  }
                  return res.redirect("/signup");
            }

            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

            const newUser = new User({
                  email,
                  username,
                  verificationOTP: otp,
                  verificationOTPExpires: otpExpires
            });
            const registeredUser = await User.register(newUser, password);

            // Send OTP email
            await sendVerificationEmail(registeredUser, otp);

            if (requestAdmin) {
                  const approvalLink = `${req.protocol}://${req.get('host')}/admin/approve/${registeredUser._id}`;
                  await sendAdminRequestEmail(registeredUser, approvalLink);
            }

            req.flash("success", "Registration successful! Please check your email for the verification code.");
            res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);

      } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
      }
}

module.exports.renderLoginForm = (req, res) => {
      res.render("users/login.ejs");
}

module.exports.login = async (req, res, next) => {
      // Check if user is verified
      if (!req.user.isVerified) {
            // Logout the user immediately since passport already logged them in
            req.logout((err) => {
                  if (err) {
                        return next(err);
                  }
                  req.flash("error", "Please verify your email before logging in. Check your inbox for the verification link.");
                  return res.redirect("/verification-pending");
            });
            return;
      }

      req.flash("success", "Welcome back to Wanderlust!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
      req.logout((err) => {
            if (err) {
                  return next(err);
            }
            req.flash("success", "you are logged out!");
            res.redirect("/listings");
      })
}

module.exports.approveAdmin = async (req, res) => {
      try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (user) {
                  user.isAdmin = true;
                  await user.save();
                  res.send(`
                        <html>
                              <head>
                                    <title>Admin Approved</title>
                                    <style>
                                          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                                          .card { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 400px; }
                                          h1 { color: #4CAF50; margin-bottom: 20px; }
                                          p { color: #666; margin-bottom: 30px; }
                                          a { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                                          a:hover { background: #45a049; }
                                    </style>
                              </head>
                              <body>
                                    <div class="card">
                                          <h1>✅ Admin Approved!</h1>
                                          <p><strong>${user.username}</strong> is now an administrator.</p>
                                          <p>They can now edit and delete any listing.</p>
                                          <a href="http://localhost:5173">Go to Wanderlust</a>
                                    </div>
                              </body>
                        </html>
                  `);
            } else {
                  res.send(`
                        <html>
                              <head>
                                    <title>Error</title>
                                    <style>
                                          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
                                          .card { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; }
                                          h1 { color: #f44336; }
                                    </style>
                              </head>
                              <body>
                                    <div class="card">
                                          <h1>❌ User Not Found</h1>
                                          <p>The user could not be found.</p>
                                    </div>
                              </body>
                        </html>
                  `);
            }
      } catch (e) {
            res.status(500).send(`
                  <html>
                        <head>
                              <title>Error</title>
                              <style>
                                    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
                                    .card { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; }
                                    h1 { color: #f44336; }
                              </style>
                        </head>
                        <body>
                              <div class="card">
                                    <h1>❌ Error</h1>
                                    <p>${e.message}</p>
                              </div>
                        </body>
                  </html>
            `);
      }
}

module.exports.verifyOTP = async (req, res) => {
      try {
            const { email, otp } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                  req.flash("error", "No account found with that email address.");
                  return res.redirect("/signup");
            }

            if (user.isVerified) {
                  req.flash("success", "Your email is already verified! You can log in now.");
                  return res.redirect("/login");
            }

            // Check if OTP is expired
            if (!user.verificationOTPExpires || Date.now() > user.verificationOTPExpires) {
                  req.flash("error", "OTP has expired. Please request a new one.");
                  return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
            }

            // Check if OTP matches
            if (user.verificationOTP !== otp) {
                  req.flash("error", "Invalid OTP. Please try again.");
                  return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
            }

            // OTP is valid - verify user
            user.isVerified = true;
            user.verificationOTP = undefined;
            user.verificationOTPExpires = undefined;
            await user.save();

            // Auto-login the user
            req.login(user, (err) => {
                  if (err) {
                        req.flash("error", "Verification successful but login failed. Please try logging in.");
                        return res.redirect("/login");
                  }
                  req.flash("success", "Email verified successfully! Welcome to Wanderlust!");
                  res.redirect("/listings");
            });

      } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
      }
}

module.exports.resendOTP = async (req, res) => {
      try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                  req.flash("error", "No account found with that email address.");
                  return res.redirect("/signup");
            }

            if (user.isVerified) {
                  req.flash("success", "Your email is already verified! You can log in now.");
                  return res.redirect("/login");
            }

            // Generate new OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.verificationOTP = otp;
            user.verificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();

            // Send OTP email
            await sendVerificationEmail(user, otp);

            req.flash("success", "New verification code sent! Please check your email.");
            res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
      } catch (e) {
            req.flash("error", e.message);
            res.redirect(`/verify-otp?email=${encodeURIComponent(req.body.email || '')}`);
      }
}
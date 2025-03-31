const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const userController = require("../controller/user.js")

// router.get("/signup",(req,res)=>{
//       res.render("users/signup.ejs");
// });
router.get("/signup",userController.register);
router.post("/signup", userController.signUpUser );

router.get("/login",userController.renderLoginForm)

router.post("/login",passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),userController.login
);
 

router.get("/logout",userController.logOut);


module.exports = router;
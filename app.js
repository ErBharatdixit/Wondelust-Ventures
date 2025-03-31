const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");  
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");  
const listings = require("./routes/listing.js");
const session = require("express-session");
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const { isLoggedIn, isReviewAuthor } = require("./middleware/middleware.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
      console.log("connected to Database");
      
}).catch(err=>{
      console.log(err);
      
})
async function main(){
      await mongoose.connect(MONGO_URL)
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
      secret:"mysupersecretcode",
      resave: false,
      saveUninitialized:true,
      cookie:{
            expires:Date.now()+7*24*60*60*1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,  
      }
};
app.get("/", (req, res) => {
      res.send("hi iam bharat");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


  



app.use((req,res,next)=>{
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currUser = req.user;
      next();

  })
  
app.use("/listings",listings);
app.use("/",userRouter);
app.post("/listings/:id/reviews",isLoggedIn, async (req, res) => {
      let { id } = req.params;

      let listing = await Listing.findById(id);
      let newReview = new Review(req.body.review);
       newReview.author = req.user._id
      
      listing.reviews.push(newReview);

      await newReview.save();
      await listing.save();
      req.flash("success", "New review Created!");

      res.redirect(`/listings/${listing._id}`);




})

// delete riview route
// app.delete("listings/:id/reviews/:reviewId", async (req, res) => {
//       let { id, reviewId } = req.params;

//       await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//       await Review.findByIdAndDelete(reviewId);
//       res.redirect(`/listings/${id}`);

// })
app.delete("/listings/:id/reviews/:reviewId", isReviewAuthor, async (req, res) => {
      let { id, reviewId } = req.params;

      try {
            const listingUpdate = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
            if (!listingUpdate) {
                  return res.status(404).send('Listing not found');
            }

            const reviewDelete = await Review.findByIdAndDelete(reviewId);
            req.flash("success", "review Deleted!");

            if (!reviewDelete) {
                  return res.status(404).send('Review not found');
            }

            res.redirect(`/listings/${id}`);
      } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
      }
});  


app.listen(8000,()=>{
      console.log("server is running to port 8000");
      
})
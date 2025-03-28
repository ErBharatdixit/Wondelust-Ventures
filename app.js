const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");  
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");  
const listings = require("./routes/listing.js");


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

 
app.get("/",(req , res)=>{
    res.send("hi iam bharat");
})
app.use("/listings",listings);

//Reviews
app.post("/listings/:id/reviews", async(req,res)=>{
      let { id } = req.params;

      let listing= await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      listing.reviews.push(newReview);

      await newReview.save();
      await listing.save();
      console.log("new review saves");
      res.redirect(`/listings/${listing._id}`);
      

      

})

// delete riview route
app.delete("/listings/:id/reviews/:reviewId", async(req,res)=>{
      let{id, reviewId } = req.params;

      await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await  Review.findByIdAndDelete(reviewId);
      res.redirect(`/listings/${id}`);

} )

// app.get("/testListing", async(req,res)=>{
//       let samplelisting = new Listing({
//             title:"My New Villa",
//             description:"By the beach",
//             price:1200,
//             location:"Calangute,Goa",
//             country:"India"

//       })
//       await samplelisting.save();
//       console.log("sample was saved");
//       res.send("successful testing");

// })
// app.use((err,req,res,next)=>{
//       res.send("something went wrong")
// })
app.listen(8080,()=>{
      console.log("server is running to port 8080");
      
})
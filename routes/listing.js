const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");  
const Review = require("../models/review.js");  


// index route
router.get("/", async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });

})
// New Route
router.get("/new", (req, res) => {
      res.render("listings/new.ejs");
})

// show route
router.get("/:id", async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      res.render("listings/show.ejs", { listing });
})
// create Route

router.post("/", async (req, res, next) => {
      try {
            const newListing = new Listing(req.body.listing);
            await newListing.save();
            res.redirect("/listings");

      } catch (err) {
            next(err);
      }

})

// Edit route

router.get("/:id/edit", async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", { listing })
})
// update route

router.put("/:id", async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing })
      res.redirect(`/listings/${id}`);
})
// Delete Route
router.delete("/:id", async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listings");


})


module.exports = router;
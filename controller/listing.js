const Listing = require("../models/listing")
module.exports.index = async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });

};

module.exports.renderNewForm = (req, res) => {

      res.render("listings/new.ejs");
}

// module.exports.showDetail = async (req, res) => {
//       let { id } = req.params;
//       const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
//       if (!listing) {
//             req.flash("success", "Listing you requested for does not exist");
//             res.redirect("/listings");
//       }
//       res.render("listings/show.ejs", { listing });
// }
module.exports.showDetail = async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findByIdAndUpdate(
            id,
            { $inc: { popularity: 1 } },   // ← increment counter each view :contentReference[oaicite:5]{index=5}
            { new: true }
      )
            .populate({
                  path: 'reviews',
                  populate: { path: 'author' }
            })
            .populate('owner');

      if (!listing) {
            req.flash('error', 'That listing does not exist.');
            return res.redirect('/listings');
      }

      res.render('listings/show', { listing });
};



module.exports.createNewListing = async (req, res, next) => {
      try {
            // Reconstruct listing object if it's sent as flat keys (listing[title], etc)
            if (!req.body.listing && Object.keys(req.body).some(key => key.startsWith('listing['))) {
                  req.body.listing = {};
                  for (let key in req.body) {
                        if (key.startsWith('listing[')) {
                              const nestedKey = key.match(/listing\[(.*?)\]/)[1];
                              req.body.listing[nestedKey] = req.body[key];
                        }
                  }
            }

            const newListing = new Listing(req.body.listing);
            newListing.owner = req.user._id;
            await newListing.save();
            req.flash("success", "New Listing Created!");
            res.redirect("/listings");

      } catch (err) {
            next(err);
      }

}
module.exports.EditListing = async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", { listing })
}

module.exports.updateListing = async (req, res) => {
      let { id } = req.params;

      // Reconstruct listing object if it's sent as flat keys (listing[title], etc)
      if (!req.body.listing && Object.keys(req.body).some(key => key.startsWith('listing['))) {
            req.body.listing = {};
            for (let key in req.body) {
                  if (key.startsWith('listing[')) {
                        const nestedKey = key.match(/listing\[(.*?)\]/)[1];
                        req.body.listing[nestedKey] = req.body[key];
                  }
            }
      }

      await Listing.findByIdAndUpdate(id, { ...req.body.listing })
      req.flash("success", "Listing updated!");

      res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
      let { id } = req.params;

      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success", " Listing Deleted!");

      res.redirect("/listings");


}
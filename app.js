if (process.env.NODE_ENV != "production") {
      require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const listingApiRouter = require("./routes/api/listing.js");
const userApiRouter = require("./routes/api/user.js");
const reviewApiRouter = require("./routes/api/review.js");
const cors = require("cors");
const { isLoggedIn, isReviewAuthor } = require("./middleware/middleware.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
      console.log("connected to Database");

}).catch(err => {
      console.log(err);

})
async function main() {
      await mongoose.connect(MONGO_URL)
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(cors({
      origin: ["http://localhost:5173", "https://wonderlust-travelportal.onrender.com", "https://wondelust-ventures-portal.onrender.com"],
      credentials: true
}));

const store = MongoStore.create({
      mongoUrl: MONGO_URL,
      touchAfter: 24 * 3600,
});

store.on("error", (err) => {
      console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
      store,
      secret: "mysupersecretcode",
      resave: false,
      saveUninitialized: false,
      cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            secure: process.env.NODE_ENV === "production",
      }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currUser = req.user;
      next();
});

app.use("/listings", listings);
app.use("/api/listings", listingApiRouter);
app.use("/api/listings/:id/reviews", reviewApiRouter);
app.use("/api/messages", require("./routes/api/message.js"));
app.use("/api/bookings", require("./routes/api/booking.js"));
app.use("/api/notifications", require("./routes/api/notification.js"));
app.use("/api", userApiRouter);
app.use("/", userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
      console.error("Global Error Handler:", err);
      const { statusCode = 500, message = "Something went wrong" } = err;
      // Check if it's an API request
      if (req.originalUrl.startsWith('/api')) {
            return res.status(statusCode).json({ error: message, stack: err.stack });
      }
      res.status(statusCode).render("error.ejs", { message });
});

app.listen(8000, () => {
      console.log("server is running to port 8000");
});
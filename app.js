if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const appError = require("./utils/appError");

const campRoutes = require("./routes/campgrounds");
const revRoutes = require("./routes/reviews");
const authRoutes = require("./routes/users");

const passport = require("passport");
const localPassport = require("passport-local");
const User = require("./models/user");
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("Mongo Connection Opened");
  })
  .catch((err) => {
    console.log("Mongo Connection error : " + err);
  });

const app = express();
const port = 8888;

//
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbesecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 24 * 60 * 60 * 7, // a week from now
    maxAge: 1000 * 24 * 60 * 60 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//
app.use((req, res, next) => {
  if (!["/login", "/register", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//

app.use("/", authRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/reviews", revRoutes);

app.get("/", (req, res) => {
  res.render("home");
});
app.all("*", (req, res, next) => {
  next(new appError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Something Went wrong";
  res.render("error", { err }).status(status);
});

app.listen(port, () => {
  console.log(`Connecting to port : ${port} `);
});

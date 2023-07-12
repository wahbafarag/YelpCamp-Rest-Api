const { campSchema, reviewSchema } = require("./joiSchema");
const appError = require("./utils/appError");
const Campground = require("./models/camps");
const expressError = require("./utils/appError");
const Review = require("./models/review");

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCamp = (req, res, next) => {
  const { err } = campSchema.validate(req.body);
  if (err) {
    const msg = err.details.map((el) => el.message).join(", ");
    throw new appError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthored = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permession to do that ");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isRevAuthored = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateRev = (req, res, next) => {
  const { e } = reviewSchema.validate(req.body);
  if (e) {
    const msg = e.details.map((el) => el.message).join(", ");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

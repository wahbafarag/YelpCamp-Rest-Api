const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/handleAsync");
const Review = require("../models/review");
const Campground = require("../models/camps");
const { validateRev, isLoggedin, isRevAuthored } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post(
  "/",
  isLoggedin,
  validateRev,

  catchAsync(reviews.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedin,
  isRevAuthored,
  catchAsync(reviews.deleteReview)
);

module.exports = router;

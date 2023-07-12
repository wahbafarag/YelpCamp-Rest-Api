const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const catchAsync = require("../utils/handleAsync");
const Campground = require("../models/camps");
const { isLoggedin, isAuthored, validateCamp } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedin,
    upload.array("image"),
    validateCamp,
    catchAsync(campgrounds.createCampground)
  );

router.route("/new").get(isLoggedin, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampgrounds))
  .put(
    isLoggedin,
    isAuthored,
    upload.array("image"),
    validateCamp,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedin, isAuthored, catchAsync(campgrounds.deleteCampground));

router
  .route("/:id/edit")
  .get(isLoggedin, isAuthored, catchAsync(campgrounds.renderEditForm));

/*
router.get("/", catchAsync(campgrounds.index));


router.post(
  "/",
  isLoggedin,
  validateCamp,
  catchAsync(campgrounds.createCampground)
);

router.get("/:id", catchAsync(campgrounds.showCampgrounds));

router.put(
  "/:id",
  isLoggedin,
  isAuthored,
  validateCamp,
  catchAsync(campgrounds.updateCampground)
);

router.delete(
  `/:id`,
  isLoggedin,
  isAuthored,
  catchAsync(campgrounds.deleteCampground)
);
*/
module.exports = router;

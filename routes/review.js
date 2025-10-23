const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//Reviews-post route
router.post("/",validateReview,
    isLoggedIn,
     wrapAsync(reviewController.createReview));


//Delete Review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
     wrapAsync(reviewController.destroyReview)
);

module.exports = router;




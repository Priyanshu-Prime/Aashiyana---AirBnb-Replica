const express = require("express");
const router = express.Router({mergeParams: true});
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviewControl = require("../controllers/review.js");

router.use(express.json());

router.post("/", isLoggedIn, validateReview, reviewControl.createReview);

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewControl.deleteReview);

module.exports = router;
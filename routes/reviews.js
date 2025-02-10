const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

router.use(express.json());

const validateReview = (req, res, next) =>
{
    let {error} = reviewSchema.validate(req.body);
    if (error)
    {
        console.log(error);
        throw new ExpressError(400, error.error);
    }
    else
        next();
};

router.post("/", validateReview, wrapAsync (async (req, res) =>
{
    console.log("Entered reviews post")
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
    console.log(await Listing.findById(req.params.id));
}));

router.delete("/:reviewId", wrapAsync (async(req, res) =>
{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    let result = await Review.findByIdAndDelete(reviewId);
    console.log(result);
    res.redirect(`/listings/${id}`);
}))

module.exports = router;
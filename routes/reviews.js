const express = require("express");
const router = express.Router({mergeParams: true});
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
    let {id} = req.params;
    // console.log(req.params);
    let listing = await Listing.findById(id);
    // console.log({listing});
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    // console.log(newReview);

    await newReview.save();
    await listing.save();

    // console.log("New review added");
    req.flash("success", "Review Added");
    res.redirect(`/listings/${listing.id}`);
    console.log(newReview.comment);
}));

router.delete("/:reviewId", wrapAsync (async(req, res) =>
    {
        let {id, reviewId} = req.params;
        
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        let result = await Review.findByIdAndDelete(reviewId);
        console.log(result);
        req.flash("success", "Review Deleted");
        res.redirect(`/listings/${id}`);
}))

module.exports = router;
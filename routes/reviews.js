const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { validateReview } = require("../middleware.js")

router.use(express.json());

router.post("/", validateReview, wrapAsync (async (req, res) =>
{
    let {id} = req.params;
    // console.log(req.params);
    let listing = await Listing.findById(id);

    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

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
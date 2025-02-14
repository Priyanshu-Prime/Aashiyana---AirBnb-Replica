const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

const reviews = require("./reviews.js");

router.use(express.json());

const validateListing = (req, res, next) =>
    {
        // console.log("Printing the data sent");
        let listing = req.body;
        // console.log(listing);
        let {error} = listingSchema.validate(listing);
        // console.log(error);
        if (error)
        {
            throw new ExpressError(400, error);
        }
        else
            next();
    };

router.get("/", wrapAsync (async (req, res) => 
{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})
);

router.get("/new", wrapAsync (async (req, res) =>
{
    res.render("listings/new.ejs");
})
);

router.get("/:id", wrapAsync (async (req, res) =>
{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    console.log(listing);
    res.render("listings/show.ejs", {listing});
})
);

router.post("/", validateListing, wrapAsync (async (req, res) =>
{
    console.log("Entered post");
    let {listing} = req.body;
    console.log(listing);
    let newListing = new Listing(listing);
    await newListing.save();   
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
})
);

router.get("/:id/edit", wrapAsync (async (req, res) =>
{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
);


router.patch("/:id", validateListing, wrapAsync (async (req, res) =>
    {
        console.log("Edit entered")
        let {id} = req.params;
        let {listing} = req.body;
        console.log(listing);
        await Listing.findByIdAndUpdate(id, 
        {
            title: listing.title,
            description: listing.description,
            price: listing.price,
            url: listing.image.url,
            location: listing.location,
            country: listing.country,
        })
        .then((res)=>console.log(res))
        .catch((err)=>console.log(err));
        res.redirect(`/listings/${id}`);
    })
);

router.delete("/:id/delete", wrapAsync (async (req, res) =>
    {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
    res.redirect("/listings");
})
);

module.exports = router;
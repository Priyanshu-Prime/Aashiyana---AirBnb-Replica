const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

const reviews = require("./reviews.js");

router.use(express.json());

router.get("/", wrapAsync (async (req, res) => 
{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})
);

router.get("/new", isLoggedIn, wrapAsync (async (req, res) =>
{
    res.render("listings/new.ejs");
})
);

router.get("/:id", wrapAsync (async (req, res) =>
{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    res.locals.currUser = req.user;
    console.log(res.locals.currUser);
    if(!listing)
    {
        req.flash("error", "Requested listing does not exist");
        res.redirect("/");
    }
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
    newListing.owner = req.user._id;
    await newListing.save();   
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
})
);

router.get("/:id/edit", isLoggedIn, wrapAsync (async (req, res) =>
{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
);


router.patch("/:id", isOwner, validateListing, wrapAsync (async (req, res) =>
    {
        console.log("Edit entered")
        let {id} = req.params;
        let {listing} = req.body;
        if(!listing)
        {
            req.flash("error", "Requested listing does not exist");
            res.redirect("/");
        }
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
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    })
);

router.delete("/:id/delete", isLoggedIn, wrapAsync (async (req, res) =>
    {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
})
);

module.exports = router;
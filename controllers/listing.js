const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { printEnv } = require("../cloudConfig.js");

module.exports.index = wrapAsync (async (req, res) => 
{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

module.exports.newListing = wrapAsync (async (req, res) =>
{
    res.render("listings/new.ejs");
})

module.exports.getListing = wrapAsync (async (req, res) =>
{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: {path: "author"}}).populate("owner");
    res.locals.currUser = req.user;
    // console.log(res.locals.currUser);
    if(!listing)
    {
        req.flash("error", "Requested listing does not exist");
        res.redirect("/");
    }
    res.render("listings/show.ejs", {listing});
});

module.exports.addListing = wrapAsync (async (req, res) =>
{
    console.log("Entered controller");
    let url = req.file.path;
    let fname = req.file.filename;
    let {listing} = req.body;
    console.log(listing);
    let newListing = new Listing(listing);
    newListing.image = {fname, url};
    newListing.owner = req.user._id;
    await newListing.save();   
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
});

module.exports.getEditListing = wrapAsync (async (req, res) =>
{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

module.exports.putEditListing = wrapAsync (async (req, res) =>
{
    console.log("Edit entered")
    let {id} = req.params;
    let {listing} = req.body;
    console.log(listing);
    if(!listing)
        {
            req.flash("error", "Requested listing does not exist");
            res.redirect("/");
        }
    let update = await Listing.findByIdAndUpdate(id, 
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

    console.log(update);
    if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let fname = req.file.filename;
        update.image = {fname, url};
        await update.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
});

module.exports.deleteListing = wrapAsync (async (req, res) =>
{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
})
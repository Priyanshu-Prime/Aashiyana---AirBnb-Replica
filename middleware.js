const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) =>
{
    if(!req.isAuthenticated())
    {
        req.session.redirectURL = req.originalUrl;
        console.log(req.originalUrl);
        req.flash("error", "Login required!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirect = (req, res, next) =>
{
    if(req.session.redirectURL)
    {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
};

module.exports.isOwner = async (req, res, next) =>
{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing || !listing.owner.equals(req.user._id))
    {
        req.flash("error", "Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) =>
{
    let listing = req.body;
    let {error} = listingSchema.validate(listing);
    if (error)
    {
        throw new ExpressError(400, error);
    }
    else
        next();
};

module.exports.validateReview = (req, res, next) =>
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
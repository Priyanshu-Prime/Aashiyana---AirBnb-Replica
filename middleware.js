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
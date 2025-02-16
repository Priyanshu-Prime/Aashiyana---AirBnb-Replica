const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");

module.exports.getSignup = wrapAsync(async(req, res) =>
{
    res.render("../views/users/signup.ejs");
});

module.exports.putSignup = wrapAsync(async(req, res) =>
{
    try
    {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const regUser = await User.register(user, password);
        console.log(regUser);
        req.login(regUser, (err) =>
        {
            if (err) return next(err);
            req.flash("success", `Welcome Aboard ${username}!`);
            res.redirect("/listings");
        });
    }
    catch(err)
    {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

module.exports.getLoginPage = wrapAsync(async(req, res) =>
{
    res.render("../views/users/login.ejs")
});

module.exports.putLogin = wrapAsync(async(req, res) =>
{
    let url = res.locals.redirectURL || "/listings";
    console.log(url);
    req.flash("success", "Welcome back to Aashiyana!");
    res.redirect(url);
});

module.exports.logout = wrapAsync (async(req, res, next) =>
{
    req.logout((err) =>
    {
        if(err)
        {
            return next(err);
        }
    });
    req.flash("success", "User logged out");
    res.redirect("/listings");
});
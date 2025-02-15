const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");

router.get("/signup", wrapAsync(async(req, res) =>
{
    res.render("../views/users/signup.ejs");
}));

router.post("/signup", wrapAsync(async(req, res) =>
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
}));

router.get("/login", wrapAsync(async(req, res) =>
{
    res.render("../views/users/login.ejs")
}));

router.post("/login", saveRedirect, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(async(req, res) =>
{
    let url = res.locals.redirectURL || "/listings";
    console.log(url);
    req.flash("success", "Welcome back to Aashiyana!");
    res.redirect(url);
}));;

router.get("/logout", wrapAsync (async(req, res, next) =>
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
}));

module.exports = router;

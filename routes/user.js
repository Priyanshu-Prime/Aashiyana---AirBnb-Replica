const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");

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
        req.flash("success", `Welcome Aboard ${username}!`)
        res.redirect("/listings");
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

router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(async(req, res) =>
{
    req.flash("success", "Welcome back to Aashiyana!");
    res.redirect("/listings");
}))

module.exports = router;

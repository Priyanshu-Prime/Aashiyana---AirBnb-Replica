const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");

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
        req.flash("success", `Welcome Asboard ${username}!`)
        res.redirect("/listings");
    }
    catch(err)
    {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}))

module.exports = router;

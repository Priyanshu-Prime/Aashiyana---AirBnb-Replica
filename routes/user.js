const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

router.get("/signup", wrapAsync(async(req, res) =>
{
    res.render("../views/users/signup.ejs");
}));

module.exports = router;

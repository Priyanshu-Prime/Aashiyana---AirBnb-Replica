const express = require("express");
const router = express.Router({mergeParams: true});
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");
const userControl = require("../controllers/user.js");

router.route("/signup")
.get(userControl.getSignup)
.post(userControl.putSignup);

router.route("/login")
.get(userControl.getLoginPage)
.post(saveRedirect, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userControl.putLogin);

router.get("/logout", userControl.logout);

module.exports = router;

const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");
const userControl = require("../controllers/user.js");

router.get("/signup", userControl.getSignup);

router.post("/signup", userControl.putSignup);

router.get("/login", userControl.getLoginPage);

router.post("/login", saveRedirect, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userControl.putLogin);

router.get("/logout", userControl.logout);

module.exports = router;

const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControl = require("../controllers/listing.js");

router.use(express.json());

router.route("/")
.get(listingControl.index)
.post(validateListing, listingControl.addListing);

router.get("/new", isLoggedIn, listingControl.newListing);

router.route("/:id")
.get(listingControl.getListing)
.patch(isOwner, validateListing, listingControl.putEditListing);

router.get("/:id/edit", isLoggedIn, listingControl.getEditListing);

router.delete("/:id/delete", isLoggedIn, listingControl.deleteListing);

module.exports = router;
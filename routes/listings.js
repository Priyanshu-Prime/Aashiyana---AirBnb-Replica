const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControl = require("../controllers/listing.js");

router.use(express.json());

router.get("/", listingControl.index);

router.get("/new", isLoggedIn, listingControl.newListing);

router.get("/:id", listingControl.getListing);

router.post("/", validateListing, listingControl.addListing);

router.get("/:id/edit", isLoggedIn, listingControl.getEditListing);

router.patch("/:id", isOwner, validateListing, listingControl.putEditListing);

router.delete("/:id/delete", isLoggedIn, listingControl.deleteListing);

module.exports = router;
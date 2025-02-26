const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControl = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer( {storage} );

router.use(express.json());

router.route("/")
.get(listingControl.index)
.post(upload.single("listing[image][url]"), validateListing, listingControl.addListing);

router.get("/new", isLoggedIn, listingControl.newListing);

router.get("/filters/:category", listingControl.getFilterPage);

router.route("/:id")
.get(listingControl.getListing)
.patch(isOwner, upload.single("listing[image][url]"), validateListing, listingControl.putEditListing);

router.get("/:id/edit", isLoggedIn, listingControl.getEditListing);

router.delete("/:id/delete", isLoggedIn, listingControl.deleteListing);

module.exports = router;
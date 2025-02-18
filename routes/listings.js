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
// .post(upload.single("listing[image][url]"), (req, res) =>
// {
//     if (!req.file) {
//         return res.status(400).send("File upload failed!");
//     }
//     console.log(req.file);
//     res.send(req.file);
// });

router.get("/new", isLoggedIn, listingControl.newListing);

router.route("/:id")
.get(listingControl.getListing)
.patch(isOwner, validateListing, listingControl.putEditListing);

router.get("/:id/edit", isLoggedIn, listingControl.getEditListing);

router.delete("/:id/delete", isLoggedIn, listingControl.deleteListing);

module.exports = router;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const link = "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = Schema(
    {
        title:
        {
            type: String,
            required: true,
        },
        description: String,
        image:
        {
            filename: String,
            url: 
            {
                default: link,
                type: String,
                set: (v) => v === "" ? link : v, // if the value is empty, set it to the default image
            }
        },
        price: Number,
        location: String,
        country: String 
    }
);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
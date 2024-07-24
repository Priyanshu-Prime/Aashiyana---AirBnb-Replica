const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");

app.use(express.static(path.join(__dirname, "/public")));

app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

let port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


async function main()
{
    await mongoose.connect(MONGO_URL);
}
main()
.then(()=> console.log("Connected to Database"))
.catch((err)=>console.log(err));

app.listen(port, () => 
{
    console.log(`Server listening on port ${port}`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
    
app.get("/", (req, res) => 
    {
        res.send("Home route working");
    });
        
app.use(express.urlencoded({extended: true}));
        // app.get("/testListing", async (req, res) => {
            //     let sampleListing = new Listing(
                //         {
                    //             title: "Ek aur Badhiya ghar",
//             description: "Mast ghar hai lelo yr",
//             price: "120",
//             location: "Amdavad",
//             country: "India"
//         }
//     );
//     await sampleListing.save()
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err));
// });

app.get("/listings", async (req, res) => 
{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

app.get("/listings/new", async (req, res) =>
{
    res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) =>
{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/show.ejs", {listing});
});

app.post("/listings", wrapAsync (async (req, res) =>
{
    console.log(req.body);
    let listing = new Listing(req.body);
    await listing.save();
    res.redirect("/listings");
})
);

app.get("/listings/:id/edit", async (req, res) =>
{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

app.use((err, req, res, next) => 
{
    res.send("Something went wrong!");
});

app.patch("/listings/:id", async (req, res) =>
{
    let {id} = req.params;
    let {title, description, price, url, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        price: price,
        url: url,
        location: location,
        country: country,
    })
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err));
    res.redirect(`/listings`);
});

app.delete("/listings/:id/delete", async (req, res) =>
{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
    res.redirect("/listings");
})
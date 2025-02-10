const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

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
    
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
    
app.get("/", (req, res) => 
    {
        res.redirect("/listings");
    });

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) =>
{
    next(new ExpressError(404, "Page Not Found"));
})


app.use((err, req, res, next) => 
{
    let {statusCode = 500, msg = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {msg})
    // res.status(statusCode).send(msg);
});
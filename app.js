const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

if(process.env.NODE_ENV != "production")
{
    require("dotenv").config();
}

const mapApi = process.env.MAP_API_KEY;

app.use(express.static(path.join(__dirname, "/public")));

app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

let port = 8080;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const DB_URL = process.env.ATLASDB_URL;

async function main()
{
    await mongoose.connect(DB_URL);
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

const store = MongoStore.create(
    {
        mongoUrl: DB_URL,
        crypto:
        {
            secret: "thisisasecret"
        },
        touchAfter: 24 * 60 * 60,
    }
)

store.on("error", () =>
{
    console.log("ERROR IN MONGODB STORE", err);
})

const sessionOptions = {
    store,
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie:
    {
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(flash());   

app.use(session(sessionOptions));   

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
    

// app.get("/demouser", wrapAsync(async (req, res) => {
    //     let fakeUser = new User(
        //         {
            //             email: "student@gmail.com",
//             username: "student"
//         }
//     )
//     let regUser = await User.register(fakeUser, "hellothere");
//     res.send(regUser);
// })
// );

app.use((req, res, next)=>
{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.users = req.user;
    res.locals.mapApi = process.env.MAP_API_KEY;
    // console.log(req.user);
    // console.log(res.locals.success);
    // console.log(res.locals.error);
    next();
})

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);

app.use("/", userRouter);

app.get("/", (req, res) => 
{
    res.redirect("/listings");
});

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

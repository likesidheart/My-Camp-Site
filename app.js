var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
// connecting the campground.js
var Campground = require("./models/campground");
// connecting the seeds.js
var seedDB = require("./seeds");
// connectiong comment.js
var Comment = require("./models/comment");
//connecting routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    

seedDB();
mongoose.connect("mongodb://localhost/my_camp_site");
//linking the public diractory
app.use(express.static(__dirname + "/public"));
// console.log(__dirname);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Node JS is Best!",
    resave: false,
    saveUninitialized: false
}));
//initializing passport
app.use(passport.initialize());
app.use(passport.session());
//to read the sessions and encode + decode the data
passport.use(new LocalStrategy(User.authenticate()));
//encoding
passport.serializeUser(User.serializeUser());
//decoding
passport.deserializeUser(User.deserializeUser());

//middleware for current user so we can use it in every header
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
//using the Routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//listening port
app.listen("3000", function () {
    console.log("Server started at localhost:3000");
});
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

seedDB();
mongoose.connect("mongodb://localhost/my_camp_site");
//linking the public diractory
app.use(express.static(__dirname + "/public"));
console.log(__dirname);

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
//************************* */
// AUTH ROUTES
//************************* */
app.get("/register", function (req, res) {
    res.render("register");
});
//handling sign up form
app.post("/register", function (req, res) {
    newUser = new User({ username: req.body.username });
    //register(package) is provided by passport local mongoose
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            })
        }
    });
});
//show Log in form
app.get("/login", function (req, res) {
    res.render("login");
});
//login logic
//app.post("/login", middlewarw, callback)
app.post("/login", passport.authenticate("local", {
    //middleware: run between two routes loggedin and login
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    if (err) {
        console.log(err);
    }
});
//logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});
//problem solved: "/loggedin" route can access only if you are loggedin
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//************************* */
//APP ROUTES
//************************* */
app.get("/", function (req, res) {
    res.render("landing");
});
//INDEX Route - show all campgrounds
//campgrounds page
app.get("/campgrounds", function (req, res) {
    // console.log(req.user);
    //Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});
//CREATE Route: creates new campground
app.post("/campgrounds", function (req, res) {
    //data from form and add to campgroung array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc }
    // create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});
//NEW Route: send form values to post method above
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});
//SHOW - shows detail of campgrounds
app.get("/campgrounds/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //console.log(foundCampground);
            //reder show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//====================
// COMMENTS ROUTES  //
//====================

app.get("/campgrounds/:id/comments/new", function (req, res) {
    //find by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", function (req, res) {
    //lookup cg with id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//listening port
app.listen("3000", function () {
    console.log("Server started at localhost:3000");
});
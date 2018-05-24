var express = require("express");
var router = express.Router(); 
var Campground = require("../models/campground");
//************************* */
//APP ROUTES
//************************* */
//INDEX Route - show all campgrounds
//campgrounds page
router.get("/", function (req, res) {
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
router.post("/", function (req, res) {
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
router.get("/new", function (req, res) {
    res.render("campgrounds/new");
});
//SHOW - shows detail of campgrounds
router.get("/:id", function (req, res) {
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

module.exports = router;
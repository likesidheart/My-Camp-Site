var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX Route - show all campgrounds    
//campgrounds page
router.get("/", function (req, res) {
    // console.log(req.user);
    //Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    });
});
//CREATE Route: creates new campground
router.post("/", isLoggedIn, function (req, res) {
    //data from form and add to campgroung array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author }
    // console.log(req.user);
    // create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});
//NEW Route: send form values to post method above
router.get("/new", isLoggedIn, function (req, res) {
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
//Edit Campground Route
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//Update Campground Route
router.put("/:id", checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//Delete Campground Route
router.delete("/:id",checkCampgroundOwnership, function (req, res) {
    //delete campground
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});
//problem solved: "/campgrounds" route can access only if you are loggedin
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
//middleware: check campground ownership
function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        //if authenticated than and than only edit route available
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                //does the  user own the campground? "check the id of loggedin user and user who created the campground"
                if (foundCampground.author.id.equals(req.user._id)) {
                    //reder edit template with that campground
                    return next(); 
                } else {
                    res.redirect("back");
                }
            }
        });
    } else { //redirect to login
        res.redirect("back");
    }
}

module.exports = router;
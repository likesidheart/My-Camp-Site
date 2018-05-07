var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// connecting the campground.js
var Campground = require("./models/campground");
// connecting the seeds.js
var seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/my_camp_site");

app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

//root
app.get("/", function(req,res){
    res.render("landing");
});

//INDEX Route - show all campgrounds
//campgrounds page
app.get("/campgrounds", function(req,res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});


//CREATE Route: creates new campground
app.post("/campgrounds", function(req,res){
    //data from form and add to campgroung array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var  newCampground = {name: name, image: image, description: desc }
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW Route: send form values to post method above
app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});

//SHOW - shows detail of campgrounds
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            //reder show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

//listening port
app.listen("3000", function () {
    console.log("Server started")
});
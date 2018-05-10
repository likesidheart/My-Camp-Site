var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
    res.render("campgrounds/new");
});

//SHOW - shows detail of campgrounds
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            //console.log(foundCampground);
            //reder show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//====================
// COMMENTS ROUTES  //
//====================

app.get("/campgrounds/:id/comments/new", function(req,res){
    //find by id
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup cg with id
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' +  campground._id);
                }
            });
        }
    });
});

//listening port
app.listen("3000", function () {
    console.log("Server started at localhost:3000");
});
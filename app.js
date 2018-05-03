var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/my_camp_site");

app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Blue Mountains",
//         image:"https://smartcanucks.ca/wp-content/uploads/2016/11/blue-mountain-ontario-deals.jpg"
//     }, function(err, campgorund) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("New Campground created");
//             console.log(campgorund);
//         }
//     }
// )

//array hardcoded
// var campgrounds = [
//     {name: "Niagara", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8q8jVVqBU45uv83Ut_Mrbfw3vjeqRYoDz7Hc7Jfbi8Sk1g1Am"},
//     {name: "Blue Mountains", image:"https://smartcanucks.ca/wp-content/uploads/2016/11/blue-mountain-ontario-deals.jpg"},
//     {name: "Point Pelee", image:"https://s3.amazonaws.com/btoimage/prism-thumbnails/articles/201846-point-pelee-park.jpg-resize_then_crop-_frame_bg_color_FFF-h_1365-gravity_center-q_70-preserve_ratio_true-w_2048_.jpg"}
// ];

//root
app.get("/", function(req,res){
    res.render("landing");
});

//campgrounds page
app.get("/campgrounds", function(req,res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

//creates new campground
app.post("/campgrounds", function(req,res){
    //data from form and add to campgroung array
    var name = req.body.name;
    var image = req.body.image;
    var  newCampground = {name: name, image: image}
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//send form values to post method above
app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});

//listening port
app.listen("3000", function () {
    console.log("Server started")
});
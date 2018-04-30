var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

//array hardcoded
var campgrounds = [
    {name: "Niagara", image:"https://www.taketours.com/images/logo/39087.jpg"},
    {name: "Blue Mountains", image:"https://smartcanucks.ca/wp-content/uploads/2016/11/blue-mountain-ontario-deals.jpg"},
    {name: "Point Pelee", image:"https://s3.amazonaws.com/btoimage/prism-thumbnails/articles/201846-point-pelee-park.jpg-resize_then_crop-_frame_bg_color_FFF-h_1365-gravity_center-q_70-preserve_ratio_true-w_2048_.jpg"}
];

//root
app.get("/", function(req,res){
    res.render("landing");
});

//campgrounds page
app.get("/campgrounds", function(req,res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

//creates new campground
app.post("/campgrounds", function(req,res){
    //data from form and add to campgroung array
    var name = req.body.name;
    var image = req.body.image;
    var  newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    //redirect to campgorund page
    res.redirect("/campgrounds");
});

//send form values to post method above
app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});

//listening port
app.listen("3000", function () {
    console.log("Server started")
});
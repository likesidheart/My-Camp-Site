var express = require("express");
var app = express();

app.set("view engine","ejs");

//root
app.get("/", function(req,res){
    res.render("landing");
});
app.get("/campgrounds", function(req,res){
    var campgrounds = [
        {name: "Niagara", image:"https://www.taketours.com/images/logo/39087.jpg"},
        {name: "Blue Mountains", image:"https://smartcanucks.ca/wp-content/uploads/2016/11/blue-mountain-ontario-deals.jpg"},
        {name: "Point Pelee", image:"https://s3.amazonaws.com/btoimage/prism-thumbnails/articles/201846-point-pelee-park.jpg-resize_then_crop-_frame_bg_color_FFF-h_1365-gravity_center-q_70-preserve_ratio_true-w_2048_.jpg"}
    ]
    res.render("campgrounds", {campgrounds: campgrounds});
});

//listening port
app.listen("3000", function () {
    console.log("Server started")
});
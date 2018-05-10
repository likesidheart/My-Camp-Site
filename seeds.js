var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [
    {
        name: "Niagara",
        image: "https://www.taketours.com/images/logo/39087.jpg",
        description: "The Regional Municipality of Niagara in Southern Ontario, Canada, lies on the west side of the Niagara River, between lakes Ontario and Erie."
    },
    {
        name: "Blue Mountains",
        image: "http://9dcccf8b91d92c9492d5-c0959210182fe02e5d4e6ad28c4e7680.r80.cf1.rackcdn.com/XLGallery/1498_Exterior.jpg",
        description: "Blue Mountain is an alpine ski resort in Ontario, Canada, just northwest of Collingwood. It is situated on a section of the Niagara Escarpment about 1 km from Nottawasaga Bay, and is a major destination for skiers from southern Ontario."
    },
    {
        name: "Banf",
        image: "https://www.waterskimag.com/sites/waterskimag.com/files/styles/1000_1x_/public/import/embedded/files/2014/02/WSKFA13P_064-1-1024x772.jpg?itok=tuSrJ-6F",
        description: "Banff is a resort town in the province of Alberta, located within Banff National Park. The peaks of Mt. Rundle and Mt. Cascade, part of the Rocky Mountains, dominate its skyline. On Banff Avenue, the main thoroughfare, boutiques and restaurants mix with château-style hotels and souvenir shops"
    }
]

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed camps");
            // add few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a campground!");
                        //create a comment
                        Comment.create(
                            {
                                text:"great place",
                                author: "Sid"
                            }, function(err, comment){
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("comment created");
                            }
                        });
                    }
                });
            });
        }
    });

    // add comments
}

module.exports = seedDB;
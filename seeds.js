var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [
    {
        name: "Niagara",
        image: "https://www.niagaraparks.com/media/2018/03/29403926_413698832426078_8517354751413714944_n.jpg",
        description: "The Regional Municipality of Niagara in Southern Ontario, Canada, lies on the west side of the Niagara River, between lakes Ontario and Erie."
    },
    {
        name: "Niagara 2",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-vqq-ziN1J7RKdmm7ZYpLAudSZR1tlPlaX_0IFTtPQPasoF1mmw",
        description: "The Regional Municipality of Niagara in Southern Ontario, Canada, lies on the west side of the Niagara River, between lakes Ontario and Erie."
    },
    {
        name: "Niagara 3",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjxKk6nzP84bErbzIMCXEziiA-DnH-7m4mkueMiU6h9_a8gQIUA",
        description: "The Regional Municipality of Niagara in Southern Ontario, Canada, lies on the west side of the Niagara River, between lakes Ontario and Erie."
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
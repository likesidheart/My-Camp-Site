var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
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
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        //if authenticated than and than only edit route available
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                //does the  user own the comment? "check the id of loggedin user and user who created the comment"
                if (foundComment.author.id.equals(req.user._id)) {
                    //reder edit template with that comment
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
middlewareObj.isLoggedIn = function(req, res, next) { 
    //problem solved: "/campgrounds" route can access only if you are loggedin
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!"); //here error is defined by user it can be anything
    res.redirect("/login");
}

module.exports = middlewareObj;
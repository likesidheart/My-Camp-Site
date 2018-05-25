var express = require("express");
var router = express.Router({mergeParams: true}); 
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments new
router.get("/new",isLoggedIn, function (req, res) {
    //find by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});
//Comments Created
router.post("/",isLoggedIn, function (req, res) {
    //lookup campground with id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // console.log(req.user.username);
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    // console.log(comment);
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
//Edit route for Comment
router.get("/:comment_id/edit", checkCommentOwnership, function(req,res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});
//update route Comments 
router.put("/:comment_id", checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//Delete Comment Route
router.delete("/:comment_id", checkCommentOwnership, function (req, res) {
    //delete comment
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//middleware: check comment ownership
function checkCommentOwnership(req, res, next) {
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

//problem solved: "/campgrounds" route can access only if you are loggedin
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
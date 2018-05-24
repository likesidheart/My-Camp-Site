var express = require("express");
var router = express.Router(); 
var passport = require("passport");
var User = require("../models/user");

//root Route
router.get("/", function (req, res) {
    res.render("landing"); 
});
// register Route
router.get("/register", function (req, res) {
    res.render("register");
});
//handling sign up form
router.post("/register", function (req, res) {
    newUser = new User({ username: req.body.username });
    //register(package) is provided by passport local mongoose
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            })
        }
    });
});
//show Log in form
router.get("/login", function (req, res) {
    res.render("login");
});
//login logic
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", {
    //middleware: run between two routes loggedin and login
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    if (err) {
        console.log(err);
    }
});
//logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
}); 
//middleware
//problem solved: "/loggedin" route can access only if you are loggedin
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
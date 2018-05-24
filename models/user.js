var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//making useSchema to store uname and pass in mongoDb
var UserSchema = new mongoose.Schema({
    username : String,
    password : String
}); 

//connecting schema with passport
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
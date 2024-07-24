const mongoose =require("mongoose");

const plm = require("passport-local-mongoose");

const user_Schema = mongoose.Schema({
    username:String,
    profileImage:{
        type:String,
        default:"/images/default.png"
    },
    password:String,
    socketId:String
})
 
user_Schema.plugin(plm);

module.exports = mongoose.model("user",user_Schema)
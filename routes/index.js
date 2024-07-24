var express = require('express');
var router = express.Router();

const user_model = require("../models/user_Schema")
const passport = require("passport");
const LocalStrategy = require("passport-local");

const messageModel = require('../models/message');

passport.use(new LocalStrategy(user_model.authenticate()));

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  const user = req.user
  res.render('index', { title: 'Express', user });
});

router.get("/register", (req, res, next) => {
  res.render("register")
})

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, profileImage } = req.body
    await user_model.register({ username, profileImage }, password)
    res.redirect("/login")
  } catch (error) {
    res.send(error)
  }
})

router.get("/login", (req, res, next) => {
  res.render("login")
})

router.post("/login",passport.authenticate("local", {
  successRedirect:"/",
  failureRedirect:"/login"
}), (req, res, next) => {


})

function isLoggedIn(req, res, next) {
  try {

    console.log(req.body)

    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login")
  } catch (err) {
    console.log(err)
  }
}

router.get("/logout",(req,res,next)=>{
  req.logout(function(error){
    if(error){return next(error)}
  })
  res.redirect("/login")
})

router.get('/getOnlineUser', isLoggedIn, async (req, res, next) => {
  const loggedInUser = req.user


  const onlineUsers = await user_model.find({
    socketId: { $ne: "" },
    _id: { $ne: loggedInUser._id }
  })

  res.status(200).json({
    onlineUsers
  })

})


router.get('/getMessage', isLoggedIn, async (req, res, next) => {

  const sender = req.user.username
  const receiver = req.query.receiver


  const messages = await messageModel.find({
    $or: [ {
      sender: sender,
      receiver: receiver
    }, {
      sender: receiver,
      receiver: sender
    } ]
  })

  res.status(200).json({
    messages
  })

})



module.exports = router;

"use strict";

const bcrypt = require("bcrypt-nodejs");
const User = require("../Models/User");
const Tweet = require("../Models/Tweet")
const jwt = require("../Services/jwt");

async function register(req, res) {
  var user = new User();
  var params = req.body.command.split(" ");

  if (params.length == 3) {
    try {
      var usedUser = await User.find({ user: params[1] });
      if (usedUser.length >= 1)
        return res.status(500).send({ message: "El Usuario ya existe" });
      bcrypt.hash(params[2], null, null, async (error, password) => {
        user.user = params[1];
        user.password = password;
        var savedUser = await user.save();
        return res.status(200).send({ message: savedUser });
      });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ message: "Error, llene todos los datos" });
  }
}

async function login(req, res) {
  var params = req.body.command.split(" ");

  if (params.length == 3) {
    try {
      var findUser = await User.findOne({ user: params[1] });
      if (!findUser)
        return res.status(500).send({ message: "El Usuario no existe" });
      bcrypt.compare(params[2], findUser.password, (err, check) => {
        if (check)
          return res.status(200).send({ token: jwt.createToken(findUser) });
        else
          return res.status(500).send({ message: "El Usuario y la contraseña no coincide" });
      });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ message: "Por favor llene los datos" });
  }
}

async function follow(req,res) {
    var params = req.body.command.split(" ");

    if (params.length == 2) {
      if(req.user.user==params[1]) return res.status(500).send({ message: "No se puede seguir a si mismo" }); 
        try {
            var findUser = await User.findOne({ user: params[1] });
            var reviewUser = await User.findOne({ _id: req.user.sub, 'following.user': findUser.user});
            if(reviewUser) return res.status(500).send({ message: "Ya sigue a este usuario" });
            var editedUser = await User.findOneAndUpdate({_id:req.user.sub}, 
                {$push:{following:{user:findUser.user}}}, 
                {new:true})
            return res.status(200).send({message: editedUser})
        } catch (error) {
          return res.status(500).send({ error });
        }
      } else {
        return res.status(500).send({ message: "Por favor llene los datos" });
      }
}

async function unfollow(req,res) {
    var params = req.body.command.split(" ");

    if (params.length == 2) {
        try {
            var findUser = await User.findOne({ user: params[1] });
            var reviewUser = await User.findOne({ _id: req.user.sub, 'following.user': findUser.user});
            if(!reviewUser) return res.status(500).send({ message: "No sigue a este usuario" });
            var editedUser = await User.findOneAndUpdate({_id:req.user.sub}, 
                {$pull:{following:{user:findUser.user}}}, 
                {new:true})
            return res.status(200).send({message: editedUser})
        } catch (error) {
          return res.status(500).send({ error });
        }
      } else {
        return res.status(500).send({ message: "Por favor llene los datos" });
      }
}

async function profile(req,res) {
    var params = req.body.command.split(" ");

    if (params.length == 2) {
            try {
                var findUser = await User.findOne({ user: params[1] });
                var followers = await User.find({'following.user': findUser.user},{user:1, _id:0});
                findUser.password = null;
                var userTweets = await Tweet.find({user: findUser._id});
                return res.status(200).send({User: findUser, followers, userTweets});
            } catch (error) {
            return res.status(500).send({ error });
            }
      } else {
        return res.status(500).send({ message: "Por favor llene los datos" });
      }
}

module.exports = {
  register,
  login,
  follow,
  unfollow,
  profile
};

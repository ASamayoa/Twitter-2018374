'use strict'

const userController = require('./UserControllers');
const tweetController = require('../Controllers/TweetController')
const md_auth = require('../Middlewares/authenticated');

function redirect(req,res){
    var comand = req.body.command.toLowerCase();
    var params = comand.split(' ')[0]
    console.log(params)
    switch(params){
        case 'register':
            userController.register(req,res);
        break;
        case 'login':
            userController.login(req,res);
        break;
        case 'follow':
            md_auth.ensureAuth(req,res);
            userController.follow(req,res);
        break;
        case 'unfollow':
            md_auth.ensureAuth(req,res);
            userController.unfollow(req,res);
        break;
        case 'profile':
            md_auth.ensureAuth(req,res);
            userController.profile(req,res);
        break;
        case 'add_tweet':
            md_auth.ensureAuth(req,res);
            tweetController.addOriginalTweet(req,res);
        break;
        case 'edit_tweet':
            md_auth.ensureAuth(req,res);
            tweetController.editTweet(req,res);
        break;
        case 'delete_tweet':
            md_auth.ensureAuth(req,res);
            tweetController.deleteTweet(req,res);
        break;
        case 'view_tweets':
            md_auth.ensureAuth(req,res);
            tweetController.viewTweets(req,res);
        break;
        default:
            return res.status(500).send({message: 'Error, revise el comando'})
    }
}

module.exports = redirect;
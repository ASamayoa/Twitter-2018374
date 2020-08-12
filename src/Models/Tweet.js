'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = Schema({
    content: String,
    type: String,
    createDate:Date,
    user: {type: Schema.ObjectId, ref:'users'},
    reference: [{
        tweet:{type: Schema.ObjectId, ref:'tweet'}
    }],
    likes: [{
        user:{type: Schema.ObjectId, ref:'users'}
    }],
    retweet: [{
        user:{type: Schema.ObjectId, ref:'users'}
    }],
    countLikes:Number,
    countRetweets:Number,
    countComments:Number
});

module.exports = mongoose.model('tweet', TweetSchema);
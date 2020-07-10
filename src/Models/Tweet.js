'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = Schema({
    content: String,
    type: String,
    createDate:Date,
    user: {type: Schema.ObjectId, ref:'users'},
    reference: [{tweet:{type: Schema.ObjectId, ref:'tweet'}}],
    likes: [{
        user:{type: Schema.ObjectId, ref:'users'}
    }]
});

module.exports = mongoose.model('tweet', TweetSchema);
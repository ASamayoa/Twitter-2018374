'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    user: String,
    password: String,
    following: [{
        user: String
    }]
});

module.exports = mongoose.model('users', UserSchema);
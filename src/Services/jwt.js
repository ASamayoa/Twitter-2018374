'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'Clave_Pato'

exports.createToken = function(User){
    var payload= {
        sub: User._id,
        user: User.user,
        email: User.email,
        iat: moment().unix(),
        exp: moment().day(30,'days').unix(),
    }
    return jwt.encode(payload,secret)
}
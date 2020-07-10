'use strict'

const express = require('express');
const Controller = require('../Controllers/GlobalController')


var api = express.Router();

api.post('/commands',Controller);

module.exports = api;

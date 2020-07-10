'use strict'

const mongoose = require('mongoose');
const app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TwitterDB', {useUnifiedTopology: true, useNewUrlParser:true}).then(()=>{
    console.log('Conectado a la base de datos');

    app.set('port', 3000);
    app.listen(app.get('port'), ()=>{
        console.log(`El clauster esta en el pruerto ${app.get('port')}`)
    })
}).catch(err=>console.log(err))
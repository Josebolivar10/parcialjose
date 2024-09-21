'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    username: String,
    password: String,
    role: { type: String, default: 'admin' } 

});

module.exports = 
    mongoose.model('usuarios', UsuarioSchema);
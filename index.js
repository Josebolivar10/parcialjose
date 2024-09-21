'use strict'

var application = require('./application');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/parcialjose")
    .then(
        () => {
            console.log("Conexion se ha establecido");
            application.listen(9898, function(){
                console.log("aplicacion iniciada")
            })
        },
        err => {
            console.log("Conexion con la BBDD fallida");
        }
    );
    
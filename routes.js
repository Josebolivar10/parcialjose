'use strict'

var express = require('express');

var peliculasController = 
require ('../controllers/peliculas');

var authenticationController 
= require("../controllers/autenticacion");

var token = require('../helpers/autenticacion');

var routes = express.Router();

routes.post('/api/pelicula',
    token.validarToken,
    peliculasController.agregarPelicula
);


routes.post('/api/usuario',
    authenticationController.registrarUsuario
);

routes.post('/api/login',
    authenticationController.iniciarSesion
);

routes.get('/api/peliculas', token.validarToken, (req, res, next) => {
    if (req.usuario.role !== 'admin') {
        return res.status(403).send({ message: "No tienes permisos para ver películas." });
    }
    next();
}, peliculasController.obtenerPeliculas);

routes.get('/api/consulta/filtrar/:anoLanzamiento/:precioMaximo',token.validarToken, peliculasController.obtenerPeliculasPorAnoYPrecio);

module.exports = routes;
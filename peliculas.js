'use strict'

const peliculas = require('../models/peliculas');
var Peliculas = require('../models/peliculas');

async function obtenerPeliculas(req, res) {
    try {
        const peliculasEncontradas = await peliculas.find({});

        if (!peliculasEncontradas || peliculasEncontradas.length === 0) {
            return res.status(404).send({ message: 'No se encontraron las películas.' });
        }

        res.status(200).send({ peliculas: peliculasEncontradas });
    } catch (err) {
        console.error(err); 
        res.status(500).send({ message: 'Error al obtener las películas.' });
    }
}

function agregarPelicula(req, resp){

    var datosRecibidos = req.body;

    var usuarioAutenticado = req.usuario; 

    if (usuarioAutenticado.role !== 'admin') {
        return resp.status(403).send({ message: "No tienes permisos para crear películas." });
    }

    var agregarPelicula = new peliculas();
    
    agregarPelicula.titulo = datosRecibidos.titulo;
    agregarPelicula.director = datosRecibidos.director;
    agregarPelicula.añoLanzamiento = datosRecibidos.añoLanzamiento
    agregarPelicula.productora = datosRecibidos.productora;
    agregarPelicula.precio = datosRecibidos.precio;

    agregarPelicula.save().then(
        (peliculaCreada) => {
            resp.status(200).send({peliculaCreada:peliculaCreada });
        },
        err => {
            console.log(err);
            resp.status(500).send({message: "No se pudo crear correctamente, intente nuevamente"});
        }
    );
}

function obtenerPeliculasPorAnoYPrecio(req, res) {
    const anoLanzamiento = req.params.anoLanzamiento; 
    const precioMaximo = req.params.precioMaximo;   

    const ano = parseInt(anoLanzamiento);
    const precio = parseFloat(precioMaximo);

    if (isNaN(ano) || isNaN(precio)) {
        return res.status(400).send({ message: 'Parámetros inválidos. Enviar un año y un precio válidos.' });
    }

    peliculas.find({
        añoLanzamiento: { $gt: ano }, 
        precio: { $lte: precio }      
    })
    .then(peliculasEncontradas => {
        if (!peliculasEncontradas || peliculasEncontradas.length === 0) {
            return res.status(404).send({ message: 'No se encontraron las películas que cumplan con los determiandos criterios.' });
        }

        res.status(200).send({ peliculas: peliculasEncontradas });
    })
    .catch(err => {
        console.error(err); 
        res.status(500).send({ message: 'Error al obtener las películas.' });
    });
}

module.exports = {
    agregarPelicula,
    obtenerPeliculas,
    obtenerPeliculasPorAnoYPrecio
}   
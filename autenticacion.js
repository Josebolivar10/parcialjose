'use strict'

var Usuario = require("../models/usuarios");
var token = require("../helpers/autenticacion");
var bcrypt = require("bcryptjs");

function registrarUsuario(req, resp){

    var parametros = req.body;
    var salt = bcrypt.genSaltSync(10);

    var password = 
        bcrypt.hashSync(parametros.password, salt);

    var nuevoUsuario = new Usuario();
    nuevoUsuario.username = parametros.username;
    nuevoUsuario.password = password;

    nuevoUsuario.save().then(
        (usuarioGuardado)=>{
            resp.status(200)
                .send({message: usuarioGuardado});
        },
        err => {
            resp.status(500)
                .send({message: 
                    "No se pudo crear correctamente el usuario"});
        }

    );

}

function iniciarSesion ( req, resp){
    var parametros = req.body;

    var usernameIngresado = parametros.username;
    var passwordIngresado = parametros.password;

    Usuario.findOne({username: usernameIngresado}).then(
        (usuarioEncontrado) => {
            if(usuarioEncontrado == null){
                resp.status(403).send({
                    message: "El usuario no existe"
                });
            }
            else{
                if(bcrypt.compareSync(
                    passwordIngresado,
                     usuarioEncontrado.password)){
                        resp.status(200).send({
                            message: "Login exitoso",
                            token: 
                            token.generarTokenUsuario(usuarioEncontrado)
                        });
                     }
                     else{
                        resp.status(403).send({
                            message: "Las credenciales son incorrectas"
                        });

                     }
            }

        },
        err=>{
            resp.status(500).send({
                message: "No pudo validarse el usuario"
            });
        }
    );
}

module.exports ={
    iniciarSesion, registrarUsuario
}

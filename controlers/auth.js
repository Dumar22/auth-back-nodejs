
const { request, response } = require('express');
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarjwt');


const login = async (req = request, res = response) => {

  const { correo, password } = req.body;

  try {
    //Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo })
    if ( !usuario ) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo'
      })
    }
    
    //si el usuario esta activo
    if ( !usuario.estado ) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado:false'
      })
    }

    //verificar contraseña
    const validPass = bcrypt.compareSync(password, usuario.password);
    if ( !validPass ) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      })
    }

    // Generar JWT
    const token = await generarJWT(usuario.id);


    res.json({
      //msg: 'login ok',
      usuario, token
  })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Alga ha salido mal, comuniquese con el administrador'
    });
  }
}


module.exports = {
  login
}
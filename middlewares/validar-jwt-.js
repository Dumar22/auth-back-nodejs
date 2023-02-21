const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario')

const validarJWT = async (req = request, res = response, next) => {
   
  const token = req.header('x-token');

  //console.log(token);
  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    });
  }

  try {
   const {uid} = jwt.verify(token, process.env.SECRETPRIVATEKEY);

    //leer usuario que corresponde a uid
    const usuario = await Usuario.findById(uid);
    //verificar si el usuario existeen DB
    if ( !usuario ) {
      return res.status(401).json({
        msg: 'Token no valido - usuario no existe en db' 
      })
    }

    // Verificar si el uid tiene estado:true
    if ( !usuario.estado ) {
      return res.status(401).json({
        msg: 'Token no valido - usuario en estado: false' 
      })
    }
    req.usuario = usuario;
   // req.uid = uid;
    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válido'
    })
  }

  
}


module.exports = {
  validarJWT
}
const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');



const usuariosGet =async(req, res = response) => {

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true }
  
  const [ total, usuarios ] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
   .skip( Number( desde ) ) 
  .limit( Number( limite ) )
  ])

  res.json({
    total,
    usuarios
   })
}

const usuariosPost = async (req = request, res = response) => {
    
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });


  //Encriptar contraseña

  const salt = await bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);
  
//guardar en db
  await usuario.save();
  res.json({
   // msg: 'post api controler',
    usuario
  })
}

const usuariosPut = async(req, res = response) => {
  
  const { id } = req.params;
  const {_id, password, google, correo, ...resto } = req.body;
  
  //Validar contra db
  if ( password ) {
    // encriptar contraseña
    const salt = await bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  // res.json({
  //   //msg: 'put api controler',
  //   usuario
  // });
  res.json(usuario);
}

const usuariosDelete = async(req, res) => {

  const { id } = req.params;

  //Eliminar Fisicamente
   //const usuario = await Usuario.findByIdAndDelete( id )

   const usuario = await Usuario.findByIdAndUpdate(id,{estado: false});
  
  res.json({ 
   usuario
  })
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete 
  
}
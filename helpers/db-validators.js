const Role = require('../models/role');
const Usuario = require('../models/usuario');



 const esRolValido = async(rol = '') => {
  const existeRol = await Role.findOne({ rol });
  if ( !existeRol ) {
    throw new Error(`El Rol ${ rol } no está registrado en la DB`)
  }
}

//Verificar si el correo exixte
const existeEmail = async( correo = '')=> {
  const emailExiste = await Usuario.findOne({ correo });
  if (emailExiste) {
   
      throw new Error(`El correo ${ correo }, ya está registrado en la DB`)
    }
}
  

//Verificar si id existe
const existeId = async( id )=> {
  const idExiste = await Usuario.findById( id );
  if ( !idExiste ) {
   
      throw new Error(`El id ${ id }, de este usuario no está registrado en la DB`)
    }
  }




module.exports = {
  esRolValido,
  existeEmail,
  existeId
}
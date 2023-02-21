
const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt-');
// const { adminRole, tieneRole } = require('../middlewares/validar-roles');
const {
  validarCampos,
  validarJWT,
  adminRole,
  tieneRole
} = require('../middlewares')


const { esRolValido, existeEmail, existeId} = require('../helpers/db-validators');
const { usuariosGet, usuariosPut, usuariosDelete, usuariosPost } = require('../controlers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.post('/', [
  check('nombre', 'el nombre es obligatorio').not().isEmpty(),
  check('password', 'la contraseña debe ser de mas de 6 caracteres').isLength({ min: 6 }),
  check('correo', 'el correo no es valido').isEmail(),
  check('correo').custom( existeEmail ),
  //check('rol', 'no es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
  check('rol').custom( esRolValido ),
  validarCampos  
], usuariosPost);

router.put('/:id', [
  check('id', 'No es un Id Valido').isMongoId(),
  check('id').custom(existeId),
  check('rol').custom( esRolValido ),
  validarCampos  
  ], usuariosPut );

router.delete('/:id', [
  validarJWT,
  //adminRole,
  tieneRole( 'ADMIN_ROLE','USER_ROLE'),
  check('id', 'No es un Id Valido').isMongoId(),
  check('id').custom(existeId),
  validarCampos  
  ], usuariosDelete);




module.exports = router;
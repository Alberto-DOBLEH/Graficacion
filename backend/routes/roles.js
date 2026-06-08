const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const { verificarToken } = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validadorMiddleware');

router.use(verificarToken);


router.get('/', rolesController.obtenerRoles);

router.post('/', [
    check('nombre_rol', 'El nombre del rol es obligatorio').not().isEmpty(),
    validarCampos
], rolesController.crearRol);

router.put('/:id', [
    check('id', 'El ID debe ser numérico').isInt(),
    check('nombre_rol', 'El nombre del rol es obligatorio').not().isEmpty(),
    validarCampos
], rolesController.actualizarRol);

router.delete('/:id', [
    check('id', 'El ID debe ser numérico').isInt(),
    validarCampos
], rolesController.eliminarRol);

module.exports = router;
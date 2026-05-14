
const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');


router.get('/', rolesController.obtenerRoles);
router.post('/', rolesController.crearRol);

module.exports = router;
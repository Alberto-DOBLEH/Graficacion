const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');

router.get('/', proyectosController.obtenerProyectos);
router.post('/', proyectosController.crearProyecto);
router.post('/asignar', proyectosController.asignarParticipante);

module.exports = router;
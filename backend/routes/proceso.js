const express = require('express');
const router = express.Router();
const procesoController = require('../controllers/procesoController');

router.get('/proyecto/:id_proyecto', procesoController.obtenerAnalisisPorProyecto);
router.post('/', procesoController.crearAnalisis);

module.exports = router;
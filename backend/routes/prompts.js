const express = require('express');
const router = express.Router();
const promptsController = require('../controllers/promptsController');
const { verificarToken } = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validadorMiddleware');

router.use(verificarToken);

router.post('/', [
    check('id_proyecto', 'El id_proyecto es obligatorio y numérico').isInt(),
    check('contenido_prompt', 'El contenido_prompt es obligatorio').not().isEmpty(),
    validarCampos
], promptsController.guardarPrompt);

router.post('/generar/:id', [
    check('id', 'El ID del proyecto debe ser numérico').isInt(),
    validarCampos
], promptsController.generarPromptMaestroConIA);

router.get('/proyecto/:id', [
    check('id', 'El ID del proyecto debe ser numérico').isInt(),
    validarCampos
], promptsController.obtenerPromptsProyecto);

router.get('/:id', [
    check('id', 'El ID del prompt debe ser numérico').isInt(),
    validarCampos
], promptsController.obtenerPrompt);

router.put('/:id', [
    check('id', 'El ID del prompt debe ser numérico').isInt(),
    check('contenido_prompt', 'El contenido_prompt es obligatorio').not().isEmpty(),
    validarCampos
], promptsController.actualizarPrompt);

router.delete('/:id', [
    check('id', 'El ID del prompt debe ser numérico').isInt(),
    validarCampos
], promptsController.eliminarPrompt);

module.exports = router;

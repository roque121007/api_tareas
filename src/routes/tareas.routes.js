const express = require('express');
const router = express.Router();

const {
    getTareas,
    getTareaById,
    createTarea,
    updateTarea,
    deleteTarea
} = require('../controllers/tareas.controller');

router.get('/', getTareas);
router.get('/:id', getTareaById);
router.post('/', createTarea);
router.put('/:id', updateTarea);
router.delete('/:id', deleteTarea);

module.exports = router;
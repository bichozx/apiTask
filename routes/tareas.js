const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Task = require('../models/tareas');
const router = express.Router();


const handleErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Crear una tarea
router.post(
    '/',
    body('title').notEmpty().withMessage('El título es obligatorio'),
    handleErrors,
    async (req, res) => {
        try {
            const { title, description } = req.body;
            const task = new Task({ title, description });
            await task.save();
            res.status(201).json({ message: 'Tarea creada exitosamente', task });
        } catch (err) {
            res.status(500).json({ message: 'Error al crear la tarea', error: err.message });
        }
    }
);

// Obtener todas las tareas con filtro opcional por estado
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status === 'completed' ? { completed: true } : status === 'pending' ? { completed: false } : {};
        const tasks = await Task.find(filter);
        res.json({ message: 'Tareas obtenidas exitosamente', tasks });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las tareas', error: err.message });
    }
});

// Obtener una tarea por ID
router.get(
    '/:id',
    param('id').isMongoId().withMessage('ID inválido'),
    handleErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const task = await Task.findById(id);
            if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
            res.json({ message: 'Tarea obtenida exitosamente', task });
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener la tarea', error: err.message });
        }
    }
);

// Actualizar una tarea
router.put(
    '/:id',
    param('id').isMongoId().withMessage('ID inválido'),
    body('title').optional().notEmpty().withMessage('El título no puede estar vacío'),
    body('completed').optional().isBoolean().withMessage('El estado debe ser booleano'),
    handleErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const task = await Task.findByIdAndUpdate(id, updates, { new: true });
            if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
            res.json({ message: 'Tarea actualizada exitosamente', task });
        } catch (err) {
            res.status(500).json({ message: 'Error al actualizar la tarea', error: err.message });
        }
    }
);

// Eliminar una tarea
router.delete(
    '/:id',
    param('id').isMongoId().withMessage('ID inválido'),
    handleErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const task = await Task.findByIdAndDelete(id);
            if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
            res.json({ message: 'Tarea eliminada exitosamente' });
        } catch (err) {
            res.status(500).json({ message: 'Error al eliminar la tarea', error: err.message });
        }
    }
);

module.exports = router;


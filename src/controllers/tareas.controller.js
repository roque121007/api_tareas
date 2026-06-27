const pool = require('../config/db');

// GET todas
const getTareas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT t.*, u.nombre AS usuario, c.nombre AS categoria
            FROM tareas t
            INNER JOIN usuarios u ON t.usuario_id = u.id
            INNER JOIN categorias c ON t.categoria_id = c.id
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// GET por ID
const getTareaById = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM tareas WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ mensaje: 'No encontrada' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// CREATE
const createTarea = async (req, res) => {
    try {
        const { titulo, descripcion, estado, usuario_id, categoria_id } = req.body;

        const [result] = await pool.query(
            `INSERT INTO tareas (titulo, descripcion, estado, usuario_id, categoria_id)
             VALUES (?, ?, ?, ?, ?)`,
            [titulo, descripcion, estado, usuario_id, categoria_id]
        );

        res.json({ mensaje: 'Tarea creada', id: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// UPDATE
const updateTarea = async (req, res) => {
    try {
        const { titulo, descripcion, estado } = req.body;

        const [result] = await pool.query(
            `UPDATE tareas SET titulo=?, descripcion=?, estado=? WHERE id=?`,
            [titulo, descripcion, estado, req.params.id]
        );

        res.json({ mensaje: 'Tarea actualizada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// DELETE
const deleteTarea = async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM tareas WHERE id=?',
            [req.params.id]
        );

        res.json({ mensaje: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = {
    getTareas,
    getTareaById,
    createTarea,
    updateTarea,
    deleteTarea
};
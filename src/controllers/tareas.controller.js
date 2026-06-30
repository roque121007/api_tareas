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
        const { titulo, descripcion, estado, usuario_id, categoria_id, fecha_limite } = req.body;

        // Si no envían usuario_id explícito, usar el del token autenticado
        const usuarioFinal = usuario_id || req.usuario?.id;

        if (!titulo || !usuarioFinal || !categoria_id)
            return res.status(400).json({ mensaje: 'titulo, categoria_id y usuario son requeridos' });

        const [result] = await pool.query(
            `INSERT INTO tareas (titulo, descripcion, estado, usuario_id, categoria_id, fecha_limite)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [titulo, descripcion, estado || 'Pendiente', usuarioFinal, categoria_id, fecha_limite || null]
        );

        res.status(201).json({ mensaje: 'Tarea creada', id: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// UPDATE
const updateTarea = async (req, res) => {
    try {
        const { titulo, descripcion, estado, fecha_limite, categoria_id } = req.body;

        const [result] = await pool.query(
            `UPDATE tareas SET titulo=?, descripcion=?, estado=?, fecha_limite=?, categoria_id=? WHERE id=?`,
            [titulo, descripcion, estado, fecha_limite || null, categoria_id, req.params.id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });

        res.json({ mensaje: 'Tarea actualizada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// DELETE
const deleteTarea = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM tareas WHERE id=?',
            [req.params.id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });

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

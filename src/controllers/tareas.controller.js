const pool = require('../config/db');

// Obtener todas las tareas
const getTareas = async (req, res) => {
    try {

        const [rows] = await pool.query(`
            SELECT
                t.id,
                t.titulo,
                t.descripcion,
                t.estado,
                t.fecha_creacion,
                u.nombre AS usuario,
                c.nombre AS categoria
            FROM tareas t
            INNER JOIN usuarios u
                ON t.usuario_id = u.id
            INNER JOIN categorias c
                ON t.categoria_id = c.id
        `);

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener tareas'
        });
    }
};

// Obtener tarea por ID
const getTareaById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            'SELECT * FROM tareas WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Tarea no encontrada'
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error' });
    }
};

// Crear tarea
const createTarea = async (req, res) => {
    try {

        const {
            titulo,
            descripcion,
            estado,
            usuario_id,
            categoria_id
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO tareas
            (
                titulo,
                descripcion,
                estado,
                usuario_id,
                categoria_id
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                titulo,
                descripcion,
                estado,
                usuario_id,
                categoria_id
            ]
        );

        res.status(201).json({
            mensaje: 'Tarea creada',
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear tarea'
        });
    }
};
// Actualizar tarea
const updateTarea = async (req, res) => {
    try {

        const { id } = req.params;
        const { titulo, descripcion, estado } = req.body;

        const [result] = await pool.query(
            `UPDATE tareas
             SET titulo = ?, descripcion = ?, estado = ?
             WHERE id = ?`,
            [titulo, descripcion, estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Tarea no encontrada'
            });
        }

        res.json({
            mensaje: 'Tarea actualizada'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error' });
    }
};

// Eliminar tarea
const deleteTarea = async (req, res) => {
    try {

        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM tareas WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Tarea no encontrada'
            });
        }

        res.json({
            mensaje: 'Tarea eliminada'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error' });
    }
};

module.exports = {
    getTareas,
    getTareaById,
    createTarea,
    updateTarea,
    deleteTarea
};
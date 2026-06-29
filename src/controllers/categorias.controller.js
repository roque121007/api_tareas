const pool = require('../config/db');

const getCategorias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getCategoriaById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const createCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        const [result] = await pool.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
        res.json({ mensaje: 'Categoría creada', id: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const updateCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        await pool.query('UPDATE categorias SET nombre=? WHERE id=?', [nombre, req.params.id]);
        res.json({ mensaje: 'Categoría actualizada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const deleteCategoria = async (req, res) => {
    try {
        await pool.query('DELETE FROM categorias WHERE id=?', [req.params.id]);
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };
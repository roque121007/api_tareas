const pool = require('../config/db');

const getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const [result] = await pool.query('INSERT INTO usuarios (nombre, email) VALUES (?, ?)', [nombre, email]);
        res.json({ mensaje: 'Usuario creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const { nombre, email } = req.body;
        await pool.query('UPDATE usuarios SET nombre=?, email=? WHERE id=?', [nombre, email, req.params.id]);
        res.json({ mensaje: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        await pool.query('DELETE FROM usuarios WHERE id=?', [req.params.id]);
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };
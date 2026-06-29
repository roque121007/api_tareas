const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, email, creado_en FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, nombre, email, creado_en FROM usuarios WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password)
            return res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });

        const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0)
            return res.status(409).json({ mensaje: 'El email ya está registrado' });

        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, passwordHash]
        );
        res.status(201).json({ mensaje: 'Usuario creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        let query, params;
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            query = 'UPDATE usuarios SET nombre=?, email=?, password=? WHERE id=?';
            params = [nombre, email, passwordHash, req.params.id];
        } else {
            query = 'UPDATE usuarios SET nombre=?, email=? WHERE id=?';
            params = [nombre, email, req.params.id];
        }

        const [result] = await pool.query(query, params);
        if (result.affectedRows === 0)
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        res.json({ mensaje: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM usuarios WHERE id=?', [req.params.id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };

const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password)
            return res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });

        // Verificar si el email ya existe
        const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0)
            return res.status(409).json({ mensaje: 'El email ya está registrado' });

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, passwordHash]
        );

        const token = jwt.sign(
            { id: result.insertId, email, nombre },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.status(201).json({
            mensaje: 'Usuario registrado',
            token,
            usuario: { id: result.insertId, nombre, email }
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ mensaje: 'Email y password son requeridos' });

        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });

        const usuario = rows[0];

        const passwordOk = await bcrypt.compare(password, usuario.password);
        if (!passwordOk)
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// GET /api/auth/me  (perfil del usuario autenticado)
const me = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, nombre, email, creado_en FROM usuarios WHERE id = ?',
            [req.usuario.id]
        );
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = { register, login, me };

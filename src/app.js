const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const tareasRoutes = require('./routes/tareas.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de tareas funcionando 🚀' });
});

// Auth (pública)
app.use('/api/auth', authRoutes);

// Rutas protegidas con JWT
app.use('/api/tareas', authMiddleware, tareasRoutes);
app.use('/api/usuarios', authMiddleware, usuariosRoutes);
app.use('/api/categorias', authMiddleware, categoriasRoutes);

module.exports = app;

const express = require('express');
const cors = require('cors');

const tareasRoutes = require('./routes/tareas.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de tareas funcionando' });
});

app.use('/api/tareas', tareasRoutes);

module.exports = app;
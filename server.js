require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    
    pool.getConnection()
        .then(conn => {
            console.log("✅ MySQL conectado correctamente");
            conn.release();
        })
        .catch(err => {
            console.error("❌ Error MySQL:", err.message);
            // No cerramos el servidor
        });
});
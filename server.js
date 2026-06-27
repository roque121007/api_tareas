require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Test de conexión MySQL (seguro, no bloquea el server)
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log("✅ MySQL conectado correctamente");
        conn.release();
    } catch (err) {
        console.error("❌ Error MySQL:", err.message);
    }
})();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
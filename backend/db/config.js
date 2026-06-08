const mysql = require('mysql2');
require('dotenv').config(); // Cargamos las variables del archivo .env

// Creamos un "Pool" de conexiones
const db = mysql.createPool({
    connectionLimit: 10, // Máximo de conexiones simultáneas
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

// Probamos la conexión al iniciar
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error al conectar a la Base de Datos:', err.message);
        return;
    }
    if (connection) {
        connection.release(); // Liberamos la conexión de prueba
        console.log('✅ Base de datos MySQL conectada exitosamente');
    }
});

module.exports = db;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Despertamos la conexión a la base de datos
require('./db/config');

// 2. Inicializamos Express
const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ mensaje: '¡El backend de Graficación está funcionando! 🚀' });
});

// --- RUTAS ---
app.use('/api/roles', require('./routes/roles'));
app.use('/api/participantes', require('./routes/participantes'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/analisis', require('./routes/proceso'));
app.use('/api/auth', require('./routes/auth'));

// 5. Encendemos el servidor para que se quede escuchando (¡Esto evita el clean exit!)
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});


const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);
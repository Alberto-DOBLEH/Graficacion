// backend/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    console.error('🔴 ERROR NO CONTROLADO:', err.stack);

    res.status(err.status || 500).json({
        error: {
            mensaje: err.message || 'Error interno del servidor',
            codigo: err.code || 'INTERNAL_ERROR'
        }
    });
};

module.exports = errorHandler;
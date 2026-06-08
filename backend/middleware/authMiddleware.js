const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Obtenemos el token del header Authorization
    const header = req.header('Authorization');
    
    if (!header) {
        return res.status(401).json({ error: 'Acceso denegado. Se requiere un token.' });
    }

    // El token normalmente viene como "Bearer <token>"
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    try {
        // Verificamos si es válido usando nuestra llave secreta
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'llave_secreta_de_respaldo');
        
        // Guardamos los datos desencriptados en la request para usarlos después si se requiere
        req.usuario = payload; 
        next(); // Le damos paso a la ruta
    } catch (error) {
        res.status(401).json({ error: 'Token no válido o ha expirado.' });
    }
};

const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }
        
        // Aquí podríamos verificar el rol del usuario si lo guardáramos en el JWT
        // Por ahora lo dejamos listo como indica el objetivo:
        // if (!rolesPermitidos.includes(req.usuario.rol)) {
        //    return res.status(403).json({ error: 'No tienes los permisos necesarios.' });
        // }
        
        next();
    };
};

module.exports = { verificarToken, verificarRol };

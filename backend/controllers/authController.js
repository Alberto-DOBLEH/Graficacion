const db = require('../db/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    // 1. Buscamos si el correo existe en la BD
    const query = 'SELECT * FROM Participantes WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });

        // Si no hay resultados, el correo no existe
        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = results[0];

        // 2. Comparamos la contraseña que escribió el usuario con la encriptada en la BD
        const passwordValido = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. ¡Login exitoso! Le creamos su Gafete Virtual (Token)
        // Usamos una "Llave Secreta" para firmar el token. (En el siguiente paso la pondremos en el .env)
        const token = jwt.sign(
            { id: usuario.id_participante, nombre: usuario.nombre, email: usuario.email },
            process.env.JWT_SECRET || 'llave_secreta_de_respaldo',
            { expiresIn: '2h' } // El token caduca en 2 horas
        );

        res.json({
            mensaje: 'Bienvenido',
            token: token,
            usuario: { id: usuario.id_participante, nombre: usuario.nombre }
        });
    });
};

module.exports = { login };
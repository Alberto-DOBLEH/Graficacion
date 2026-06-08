const db = require('../db/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ─── LOGIN ───────────────────────────────────────────────────
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const query = 'SELECT * FROM Participantes WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = results[0];
        const passwordValido = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id_participante, nombre: usuario.nombre, email: usuario.email },
            process.env.JWT_SECRET || 'llave_secreta_de_respaldo',
            { expiresIn: '8h' }
        );

        res.json({
            mensaje: 'Bienvenido',
            token: token,
            usuario: { id: usuario.id_participante, nombre: usuario.nombre, email: usuario.email }
        });
    });
};

// ─── REGISTRO ────────────────────────────────────────────────
const registro = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO Participantes (nombre, email, password_hash) VALUES (?, ?, ?)';
        db.query(query, [nombre, email, passwordHash], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El email ya está registrado' });
                }
                return res.status(500).json({ error: 'Error al guardar en la base de datos' });
            }

            // Auto-login tras registro: devolvemos el token directamente
            const token = jwt.sign(
                { id: results.insertId, nombre, email },
                process.env.JWT_SECRET || 'llave_secreta_de_respaldo',
                { expiresIn: '8h' }
            );

            res.status(201).json({
                mensaje: 'Registrado exitosamente',
                token: token,
                usuario: { id: results.insertId, nombre, email }
            });
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { login, registro };
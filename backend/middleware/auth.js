// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_temporal';

const verifyToken = (req, res, next) => {
    // 1. Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    console.log('Verificando token...');
    console.log('Authorization header:', authHeader);

    // El formato debe ser: "Bearer eyJhbGciOiJIUzI1NiIs..."
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Token no proporcionado o formato incorrecto');
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    // Extraer el token (quitamos "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token con la clave secreta
        const verified = jwt.verify(token, JWT_SECRET);

        // 3. Adjuntar la información del usuario al request
        req.user = verified;

        console.log('Token válido para usuario:', verified.email);

        // 4. Continuar con la siguiente función
        next();
    } catch (error) {
        console.error('Error verificando token:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado. Inicia sesión nuevamente.' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Token inválido.' });
        }

        return res.status(403).json({ error: 'Error de autenticación.' });
    }
};

module.exports = { verifyToken };
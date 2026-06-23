// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../utils/database');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_temporal';

async function register(req, res) {
    try {
        console.log('=== INICIO REGISTRO ===');
        console.log('Body recibido:', req.body);
        const { email, password } = req.body;

        // Validaciones
        if (!email || !password) {
            console.log('Faltan mail o password');
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }
        if (password.length < 8) {
            console.log(' Password muy corta');
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }
        console.log(' Validaciones pasadas');
        console.log('Buscando usuario existente...');
        // Verificar si existe
        const existingUser = await findUserByEmail(email);
        console.log('Resultado búsqueda:', existingUser);
        if (existingUser) {
            console.log(' Usuario ya existe');
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Hashear contraseña
        console.log('Hasheando contraseña...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Contraseña Hasheada...');
        // Crear usuario
        console.log('Creando usuario...');
        const newUser = await createUser({
            email,
            password_hash: hashedPassword
        });
        console.log('Usuario creado:', newUser);
        console.log('=== FIN REGISTRO EXITOSO ===');
        // No devolver el hash en la respuesta
        const { password_hash, ...userWithoutPassword } = newUser;

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        console.log('Body recibido en login:', req.body);
        console.log('Buscando usuario con email:', email);
        if (!email || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        // Buscar usuario
        const user = await findUserByEmail(email);
        console.log('Usuario encontrado:', user ? 'Sí' : 'No');
        if (!user) {
            console.log('Usuario no encontrado para email:', email);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        console.log('Verificando contraseña...');
        const validPassword = await bcrypt.compare(password, user.password_hash);
        console.log('Contraseña válida:', validPassword ? 'Sí' : 'No');
        if (!validPassword) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Login exitoso para:', email);
        res.json({
            message: 'Login exitoso',
            token,
            user: { id: user.id, username: user.email }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { register, login };
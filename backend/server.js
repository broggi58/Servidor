/*const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("BACK recibe:", {
        email: JSON.stringify(email),
        password: JSON.stringify(password)
    });

    if (email == "broggi@outlook.com" && password == "Asdasd123") {
        return res.status(200).json({ message: "Login OK" });
    } else {
        return res.status(401).json({ message: "Credenciales incorrectas" });
    }
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});*/

// server.js
//require('archivo.env').config();
require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const protectedRoutes = require('./routes/protected');

const app = express();
app.use(cors());
const PORT = 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
console.log(process.env.JWT_SECRET);
// Validar que existan
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('Faltan variables de entorno ADMIN_USERNAME o ADMIN_PASSWORD');
    process.exit(1);
}

app.post('/login_viejo', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({
            message: 'Login exitoso',
            user: { username: ADMIN_USERNAME, role: 'admin' }
        });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/auth', authRoutes);      // /auth/register, /auth/login
app.use('/api', protectedRoutes);   // /api/perfil, /api/datos

// Manejo de errores global (opcional pero recomendado)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// routes/protected.js
const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
console.log(verifyToken);
// Todas las rutas de este router requieren token
router.use(verifyToken);

router.get('/perfil', (req, res) => {
    res.json({
        message: 'Acceso a perfil autorizado',
        user: req.user
    });
});

router.get('/datos', (req, res) => {
    res.json({
        message: 'Datos sensibles',
        data: ['item1', 'item2', 'item3']
    });
});

module.exports = router;
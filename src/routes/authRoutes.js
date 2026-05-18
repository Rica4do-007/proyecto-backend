const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

// Parte 3 - Paso 6: Definición de rutas para el Módulo de Usuarios
// Ruta para registro: POST /app/auth/register
router.post('/register', authControllers.registrarUsuario);

// Parte 3 - Paso 7: Definición de rutas para autenticación
// Ruta para login: POST /app/auth/login
router.post('/login', authControllers.login);

// Exportación del router para ser utilizado en app.js (Parte 2)
module.exports = router;
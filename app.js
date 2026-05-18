const path = require('path');
const cors = require('cors');
const express = require('express');
const conectarDB = require('./src/config/db');
const auth = require('./src/middlewares/authMiddleware');
require('dotenv').config();

const app = express();

// 1. Conexión a la base de datos (Parte 1: Configuración de MongoDB)
// Esta parte asegura que los modelos de la Parte 3 y 4 funcionen correctamente.
conectarDB();

// 2. Importar rutas para los módulos del proyecto
const authRoutes = require('./src/routes/authRoutes');
const tasksRoutes = require('./src/routes/tasksRoutes');

// 3. Middleware para procesar JSON (Requisito para los Pasos 6, 7, 8, 9 y 11)
// Permite que el servidor lea el "Body" de tus comandos en PowerShell.
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// 4. Ruta de salud (Parte 2 - Paso 2: Verificar que el servidor funciona)
// Captura recomendada: Ejecuta un GET a /app/health para mostrar { status: "ok" }
app.get('/app/health', (req, res) => {
    res.json({ status: "ok" });
});

// 5. Definición de rutas principales
// Módulo de Usuarios (Parte 3) y Módulo de Tareas (Parte 4 - CRUD)
app.use('/app/auth', authRoutes);
app.use('/app/tasks', tasksRoutes);

// 6. Manejo de rutas no encontradas (Parte 6: Manejo de Errores)
// Captura recomendada: Intenta acceder a una ruta que no existe para mostrar el formato JSON de error.
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: "Ruta no encontrada"
    });
});

// 7. Configuración del puerto y encendido (Paso 1: Levantar el servidor)
// Al llamar a este archivo app.js, el log confirmará que el proceso inició con éxito.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



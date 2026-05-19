const express = require('express');
const router = express.Router();
const taskControllers = require('../controllers/tasksControllers'); 
const auth = require('../middlewares/authMiddleware');

// Parte 4 - Módulo de Tareas: Operaciones CRUD
// Todas las rutas requieren el middleware 'auth' (Seguridad/Token)

// Paso 9: Crear tarea (POST /app/tasks)
router.post('/', auth, taskControllers.crearTarea);

// Paso 10: Obtener tareas del usuario (GET /app/tasks)
router.get('/', auth, taskControllers.obtenerTareas);

// Paso 11: Actualizar tarea (PUT /app/tasks/:id)
router.put('/:id', auth, taskControllers.actualizarTarea);

// Paso 11: Eliminar tarea (DELETE /app/tasks/:id)
router.delete('/:id', auth, taskControllers.eliminarTarea);

// Exportación para ser usado en app.js
module.exports = router;
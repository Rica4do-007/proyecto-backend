const Task = require('../models/tasks');

// Parte 4 - Paso 9: Crear tarea (Operación Create)
exports.crearTarea = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Se asigna el ID del usuario desde el Token (Seguridad Parte 3)
    const nuevaTarea = new Task({
      title,
      description,
      user_id: req.user.id 
    });

    await nuevaTarea.save();
    res.status(201).json({ mensaje: "Tarea creada con éxito", tarea: nuevaTarea });
  } catch (error) {
    // Parte 6: Manejo de Errores
    res.status(500).json({ mensaje: "Error al crear la tarea", error: error.message });
  }
};

// Parte 4 - Paso 10: Obtener tareas (Operación Read)
exports.obtenerTareas = async (req, res) => {
  try {
    // Filtro por user_id para asegurar que solo vea sus propias tareas
    const tareas = await Task.find({ user_id: req.user.id });
    res.json(tareas);
  } catch (error) {
    // Parte 6: Manejo de Errores
    res.status(500).json({ mensaje: "Error al obtener tareas", error: error.message });
  }
};

// Parte 4 - Paso 11: Actualizar tarea (Operación Update)
exports.actualizarTarea = async (req, res) => {
  try {
    const tarea = await Task.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id }, // Validación de propiedad
      req.body, 
      { new: true, runValidators: true } // <-- ¡AQUÍ LO AÑADES! Esto obligará a validar el enum
    );

    if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });
    res.json({ mensaje: "Tarea actualizada", tarea });
  } catch (error) {
    // Parte 6: Manejo de Errores
    // Como ahora Mongoose lanzará un error de validación (400), puedes atraparlo aquí de forma consistente
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: true, 
        message: error.message // Ej: "terminado no es un estado válido"
      });
    }

    res.status(500).json({ 
      error: true, 
      message: "Error al actualizar" 
    });
  }
};

// Parte 4 - Paso 11: Eliminar tarea (Operación Delete)
exports.eliminarTarea = async (req, res) => {
  try {
    const tarea = await Task.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });

    if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });
    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    // Parte 6: Manejo de Errores
    res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
  }
};
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  // Parte 4 - Paso 8: Definición de la estructura de la tarea
  title: { 
    type: String, 
    // Parte 5: Validaciones de datos
    required: true // Campo obligatorio para cumplir con la validación de la Parte 5
  },
  
  description: { 
    type: String 
  },
  
  status: { 
    type: String, 
    // Parte 5: Validaciones de datos
    enum: {
      values: ['pending', 'in_progress', 'done'],
      message: '{VALUE} no es un estado válido'
    },
    default: 'pending' 
  },
  
  due_date: { 
    type: Date 
  },
  
  // Parte 4 - Paso 8: Relación entre colecciones
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Referencia que establece la relación "1 usuario a muchas tareas"
    required: true 
  }
});

// Parte 4 - Paso 8: Exportación del modelo para ser usado en el proyecto
module.exports = mongoose.model('Tasks', TaskSchema);
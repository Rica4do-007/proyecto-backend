const mongoose = require('mongoose');
const validator = require('validator'); // Para validar el formato del correo electrónico (Parte 5: Validaciones)
const bcrypt = require('bcryptjs'); // Para encriptar la contraseña (Parte 3: Seguridad)

const UserSchema = new mongoose.Schema({
  // Parte 3 - Paso 3 y 4: Definición de la estructura del usuario
  email: { 
    type: String, 
    // Parte 5: Validaciones de datos
    required: true, // Campo obligatorio
    unique: true,   // No permite correos electrónicos duplicados
    lowercase: true, // Convierte el email a minúsculas
    validate: {
      validator: validator.isEmail, // Validación de formato de email
      message: 'Correo electrónico no válido'
    }
  },
  
  password: { 
    type: String,
    // Parte 5: Validaciones de datos
    required: true, // Campo obligatorio
    minlength: 6  // Longitud mínima de la contraseña
  },

  createdAt: { 
    type: Date, 
    default: Date.now // Valor por defecto: fecha y hora actual
  }
});

// Parte 3 - Paso 6 y 7 (Seguridad): Encriptación de contraseña
// Este middleware se ejecuta antes de guardar el usuario en la base de datos
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10); // Generación de sal
  this.password = await bcrypt.hash(this.password, salt); 
});

module.exports = mongoose.model('Users', UserSchema);
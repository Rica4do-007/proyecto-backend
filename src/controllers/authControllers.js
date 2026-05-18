const User = require('../models/users'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

// Parte 3 - Paso 5: Registro de Usuarios
// Función para registrar un nuevo usuario en la base de datos
exports.registrarUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // El modelo 'User' se encarga de encriptar la contraseña (Seguridad Parte 3)
    const nuevoUsuario = new User({ email, password });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    // Parte 6: Manejo de Errores (Campos inválidos o correo duplicado)
    res.status(400).json({ mensaje: "Error al registrar usuario", error: error.message });
  }
};

// Parte 3 - Paso 6: Inicio de Sesión (Login) y Generación de Token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verificación de existencia (Seguridad)
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    // 2. Comparar la contraseña ingresada con el Hash de la base de datos (bcrypt)
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // 3. Generación del Token JWT (Paso 7: Autenticación)
    // Se usa la JWT_SECRET definida en el archivo .env
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: '1h' 
    });

    res.json({ mensaje: "Login exitoso", token });
  } catch (error) {
    // Parte 6: Manejo de Errores de servidor
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};
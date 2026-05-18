const jwt = require('jsonwebtoken');

// Parte 3 - Pasos 6 y 7: Middleware de Autenticación (Seguridad)
// Este archivo es el encargado de proteger las rutas privadas del proyecto.
module.exports = (req, res, next) => {
  // 1. Obtener el token del header 'Authorization'
  const authHeader = req.header('Authorization');

  // Parte 6: Manejo de Errores (Token ausente)
  if (!authHeader) {
    return res.status(401).json({ mensaje: "Acceso denegado, no hay token" });
  }

  // El formato suele ser "Bearer TOKEN", así que extraemos solo el token
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verificar el token usando la clave secreta (Seguridad de la Parte 3)
    const cifrado = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardamos los datos del usuario en la petición para ser usados en la Parte 4 (Tareas)
    req.user = cifrado; 
    
    next(); // Continuar a la siguiente función (Controlador)
  } catch (error) {
    // Parte 6: Manejo de Errores (Token inválido o expirado)
    res.status(400).json({ mensaje: "Token no válido" });
  }
};
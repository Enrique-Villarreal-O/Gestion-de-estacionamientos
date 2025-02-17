const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
exports.protect = async (req, res, next) => {
  let token;

  // Verificar si el token está presente en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Si no hay token, devolver un error
  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password'); // Excluir la contraseña

    if (!user) {
      return res.status(401).json({ message: 'El usuario no existe.' });
    }

    // Adjuntar el usuario al objeto de solicitud
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

// Middleware para autorizar roles específicos
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Verificar si el rol del usuario está permitido
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permisos suficientes.' });
    }

    next();
  };
};
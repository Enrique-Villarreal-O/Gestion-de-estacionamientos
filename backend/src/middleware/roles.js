// Middleware para autorizar roles específicos
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Verificar si el rol del usuario está permitido
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permisos suficientes.' });
    }

    next();
  };
};
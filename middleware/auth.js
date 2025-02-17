const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Token inválido' });
  }
};

module.exports = auth;
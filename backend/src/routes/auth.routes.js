const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Ruta para registro de usuario
router.post('/register', authController.register);

// Ruta para inicio de sesión
router.post('/login', authController.login);

module.exports = router;
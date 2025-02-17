const express = require('express');
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth'); // Middleware de autenticación
const { authorizeRoles } = require('../middleware/roles'); // Middleware de autorización por roles

const router = express.Router();

// Proteger todas las rutas con autenticación JWT
router.use(protect);

// Ruta para listar los primeros 50 usuarios (solo accesible para administradores)
router.get('/', authorizeRoles('admin'), userController.listUsers);

// Ruta para buscar un usuario por email (solo accesible para administradores)
router.get('/:email', authorizeRoles('admin'), userController.findUserByEmail);

// Ruta para crear un nuevo usuario (solo accesible para administradores)
router.post('/', authorizeRoles('admin'), userController.createUser);

// Ruta para actualizar un usuario (solo accesible para administradores)
router.put('/:id', authorizeRoles('admin'), userController.updateUser);

// Ruta para eliminar un usuario (solo accesible para administradores)
router.delete('/:id', authorizeRoles('admin'), userController.deleteUser);

module.exports = router;
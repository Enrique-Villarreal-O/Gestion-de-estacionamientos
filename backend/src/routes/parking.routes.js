const express = require('express');
const parkingController = require('../controllers/parking.controller');
const { protect } = require('../middleware/auth'); // Middleware de autenticación
const { authorizeRoles } = require('../middleware/roles'); // Middleware de autorización por roles

const router = express.Router();

// Proteger todas las rutas con autenticación JWT
router.use(protect);

// Ruta para listar estacionamientos (accesible para todos los usuarios autenticados)
router.get('/', parkingController.listParkings);

// Ruta para crear un nuevo estacionamiento (solo accesible para propietarios)
router.post('/', authorizeRoles('owner'), parkingController.createParking);

// Ruta para actualizar un estacionamiento (solo accesible para propietarios)
router.put('/:id', authorizeRoles('owner'), parkingController.updateParking);

// Ruta para eliminar un estacionamiento (solo accesible para propietarios)
router.delete('/:id', authorizeRoles('owner'), parkingController.deleteParking);

// Ruta para aceptar una oferta de alquiler (solo accesible para propietarios)
router.post('/:id/accept-offer', authorizeRoles('owner'), parkingController.acceptRentalOffer);

module.exports = router;
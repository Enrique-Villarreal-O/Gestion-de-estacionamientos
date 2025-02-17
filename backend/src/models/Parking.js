const mongoose = require('mongoose');

// Esquema del estacionamiento
const ParkingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo de usuario (propietario)
      required: [true, 'El propietario es obligatorio.'],
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria.'],
      trim: true, // Elimina espacios en blanco al inicio y final
    },
    pricePerHour: {
      type: Number,
      required: [true, 'El precio por hora es obligatorio.'],
      min: [0, 'El precio por hora no puede ser negativo.'],
    },
    location: {
      type: String,
      required: [true, 'La ubicación es obligatoria.'],
      trim: true,
    },
    images: {
      type: [String], // Array de URLs de imágenes
      default: [], // Por defecto, un array vacío
    },
    available: {
      type: Boolean,
      default: true, // Por defecto, el estacionamiento está disponible
    },
    rentalDetails: {
      tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo de usuario (arrendatario)
      },
      pricePerHour: {
        type: Number,
        min: [0, 'El precio por hora no puede ser negativo.'],
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
  },
  { timestamps: true } // Agrega campos `createdAt` y `updatedAt`
);

// Modelo de estacionamiento
const Parking = mongoose.model('Parking', ParkingSchema);

module.exports = Parking;
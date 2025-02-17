const Parking = require('../models/Parking');
const User = require('../models/User');
const { uploadFile } = require('../utils/upload'); // Utilidad para subir imágenes

// Listar estacionamientos (con filtros)
exports.listParkings = async (req, res) => {
  try {
    const { available } = req.query; // Filtro por disponibilidad
    const filter = {};

    if (available !== undefined) {
      filter.available = available === 'true'; // Convertir a booleano
    }

    const parkings = await Parking.find(filter).populate('owner', 'name email'); // Incluir datos del propietario
    res.status(200).json(parkings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los estacionamientos.' });
  }
};

// Crear un nuevo estacionamiento
exports.createParking = async (req, res) => {
  try {
    const { description, pricePerHour, location } = req.body;
    const { files } = req;

    // Subir imágenes y obtener las URLs
    const imageUrls = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await uploadFile(file, req.user._id); // Subir archivo al servidor
        imageUrls.push(url);
      }
    }

    // Crear el estacionamiento
    const newParking = new Parking({
      owner: req.user._id,
      description,
      pricePerHour,
      location,
      images: imageUrls,
      available: true, // Por defecto, el estacionamiento está disponible
    });

    await newParking.save();

    res.status(201).json({
      message: 'Estacionamiento creado exitosamente.',
      parking: newParking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el estacionamiento.' });
  }
};

// Modificar un estacionamiento
exports.updateParking = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, pricePerHour, location, available } = req.body;

    // Verificar si el estacionamiento existe
    const parking = await Parking.findById(id);
    if (!parking) {
      return res.status(404).json({ message: 'Estacionamiento no encontrado.' });
    }

    // Solo el propietario puede modificar su estacionamiento
    if (parking.owner.toString() !== req.user._id) {
      return res.status(403).json({ message: 'No tienes permisos para modificar este estacionamiento.' });
    }

    // Actualizar el estacionamiento
    parking.description = description || parking.description;
    parking.pricePerHour = pricePerHour || parking.pricePerHour;
    parking.location = location || parking.location;
    parking.available = available !== undefined ? available : parking.available;

    await parking.save();

    res.status(200).json({
      message: 'Estacionamiento actualizado exitosamente.',
      parking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estacionamiento.' });
  }
};

// Eliminar un estacionamiento
exports.deleteParking = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el estacionamiento existe
    const parking = await Parking.findById(id);
    if (!parking) {
      return res.status(404).json({ message: 'Estacionamiento no encontrado.' });
    }

    // Solo el propietario puede eliminar su estacionamiento
    if (parking.owner.toString() !== req.user._id) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este estacionamiento.' });
    }

    // No se puede eliminar si ya está alquilado
    if (!parking.available) {
      return res.status(400).json({ message: 'No se puede eliminar un estacionamiento alquilado.' });
    }

    await Parking.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Estacionamiento eliminado exitosamente.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el estacionamiento.' });
  }
};

// Aceptar una oferta de alquiler
exports.acceptRentalOffer = async (req, res) => {
  try {
    const { id } = req.params; // ID del estacionamiento
    const { tenantId, pricePerHour, startDate, endDate } = req.body;

    // Verificar si el estacionamiento existe
    const parking = await Parking.findById(id);
    if (!parking) {
      return res.status(404).json({ message: 'Estacionamiento no encontrado.' });
    }

    // Solo el propietario puede aceptar ofertas
    if (parking.owner.toString() !== req.user._id) {
      return res.status(403).json({ message: 'No tienes permisos para aceptar esta oferta.' });
    }

    // No se puede aceptar una oferta si el estacionamiento ya está alquilado
    if (!parking.available) {
      return res.status(400).json({ message: 'El estacionamiento ya está alquilado.' });
    }

    // Marcar el estacionamiento como no disponible
    parking.available = false;
    parking.rentalDetails = {
      tenant: tenantId,
      pricePerHour,
      startDate,
      endDate,
    };

    await parking.save();

    res.status(200).json({
      message: 'Oferta de alquiler aceptada exitosamente.',
      parking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al aceptar la oferta de alquiler.' });
  }
};
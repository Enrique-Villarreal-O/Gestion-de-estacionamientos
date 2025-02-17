const User = require('../models/User');
exports.createUser = async (req, res) => {
  try {
    // Verificar permisos de admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    const { name, email, password, role } = req.body;

    // Validar campos requeridos
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const newUser = new User({
      name,
      email,
      password,
      role
    });

    // Guardar en base de datos
    const savedUser = await newUser.save();
    
    // Excluir password en la respuesta
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt
    };

    res.status(201).json(userResponse);

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// @desc    Obtener todos los usuarios (solo admin)
exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acceso no autorizado' });
    }
    
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

exports.getUserById = async (req, res) => { /* ... */ };

// @desc    Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acceso no autorizado' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acceso no autorizado' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Usuario eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};
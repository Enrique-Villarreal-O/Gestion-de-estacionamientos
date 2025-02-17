const User = require('../models/User');

// Listar los primeros 50 usuarios
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().limit(50).select('-password'); // Excluir la contraseña
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los usuarios.' });
  }
};

// Buscar usuario por email
exports.findUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).select('-password'); // Excluir la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar el usuario.' });
  }
};

// Crear un nuevo usuario (solo para administradores)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario creado exitosamente.',
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario.' });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({
      message: 'Usuario actualizado exitosamente.',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({
      message: 'Usuario eliminado exitosamente.',
      user: { id: deletedUser._id, name: deletedUser.name, email: deletedUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario.' });
  }
};
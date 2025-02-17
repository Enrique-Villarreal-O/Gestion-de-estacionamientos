const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas

// Esquema del usuario
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true, // Elimina espacios en blanco al inicio y final
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio.'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, ingresa un correo electrónico válido.',
      ],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria.'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'],
      select: false, // No se incluye la contraseña por defecto en las consultas
    },
    role: {
      type: String,
      enum: ['admin', 'owner', 'tenant'], // Roles permitidos
      default: 'tenant', // Rol por defecto
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Agrega campos `createdAt` y `updatedAt`
);

// Middleware para encriptar la contraseña antes de guardar el usuario
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Si la contraseña no ha cambiado, no la encripta nuevamente
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Modelo de usuario
const User = mongoose.model('User', UserSchema);

module.exports = User;
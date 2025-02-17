const mongoose = require('mongoose');

// Configuración de la conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1); // Detiene la aplicación si hay un error en la conexión
  }
};

module.exports = connectDB;
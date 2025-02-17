const http = require('http');
const connectDB = require('./config/db'); // Conexión a MongoDB
const app = require('./app'); // Configuración de Express
const { setupSocket } = require('./utils/socket'); // Configuración de Socket.IO

// Conectar a la base de datos
connectDB();

// Crear el servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = setupSocket(server);

// Asignar Socket.IO a la instancia de Express
app.set('io', io);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
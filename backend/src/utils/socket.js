const socketIo = require('socket.io');

// Configuración de Socket.IO
exports.setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*', // Permitir conexiones desde cualquier origen (ajusta según tus necesidades)
      methods: ['GET', 'POST'], // Métodos HTTP permitidos
    },
  });

  // Almacenar sockets conectados por usuario
  const userSockets = {};

  // Evento de conexión
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Registrar el socket del usuario
    socket.on('registerUser', (userId) => {
      userSockets[userId] = socket.id;
      console.log(`Usuario registrado: ${userId}`);
    });

    // Enviar notificación al propietario cuando se recibe una oferta
    socket.on('sendOfferNotification', ({ ownerId, message }) => {
      const ownerSocketId = userSockets[ownerId];
      if (ownerSocketId) {
        io.to(ownerSocketId).emit('offerNotification', { message });
      }
    });

    // Enviar notificación al arrendatario cuando su oferta es aceptada
    socket.on('sendAcceptanceNotification', ({ tenantId, message }) => {
      const tenantSocketId = userSockets[tenantId];
      if (tenantSocketId) {
        io.to(tenantSocketId).emit('acceptanceNotification', { message });
      }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.id}`);
      // Eliminar el socket del usuario del registro
      for (const userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
          break;
        }
      }
    });
  });

  return io;
};
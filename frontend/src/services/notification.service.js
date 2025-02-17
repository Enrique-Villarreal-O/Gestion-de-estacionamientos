import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL);

export const setupNotifications = (userId, onNotification) => {
  socket.emit('registerUser', userId);

  socket.on('offerNotification', (data) => {
    onNotification(data.message);
  });

  socket.on('acceptanceNotification', (data) => {
    onNotification(data.message);
  });
};
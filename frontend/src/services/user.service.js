import api from './api'; // Importar la instancia de Axios configurada

// Función para listar los primeros 50 usuarios
export const listUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error al listar los usuarios:', error);
    throw new Error('Error al obtener los usuarios.');
  }
};

// Función para buscar un usuario por email
export const findUserByEmail = async (email) => {
  try {
    const response = await api.get(`/users/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    throw new Error('Error al buscar el usuario.');
  }
};

// Función para crear un nuevo usuario
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw new Error('Error al crear el usuario.');
  }
};

// Función para actualizar un usuario
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw new Error('Error al actualizar el usuario.');
  }
};

// Función para eliminar un usuario
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    throw new Error('Error al eliminar el usuario.');
  }
};
import api from './api'; // Importar la instancia de Axios configurada

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;

    // Guardar token en localStorage
    localStorage.setItem('token', token);

    return user;
  } catch (error) {
    throw new Error('Credenciales inválidas.');
  }
};

// Función para registrar un nuevo usuario
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;

    // Guardar token en localStorage
    localStorage.setItem('token', token);

    return user;
  } catch (error) {
    throw new Error('Error al registrar usuario.');
  }
};

// Función para cerrar sesión
export const logout = () => {
  // Eliminar token del localStorage
  localStorage.removeItem('token');
};
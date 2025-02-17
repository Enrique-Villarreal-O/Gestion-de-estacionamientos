import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api'; // Importar Axios configurado

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario
  const [token, setToken] = useState(localStorage.getItem('token') || null); // Token JWT
  const navigate = useNavigate();

  // Verificar si el token es válido al cargar la aplicación
  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user); // Guardar datos del usuario
        } catch (error) {
          console.error('Error al verificar el token:', error);
          logout(); // Cerrar sesión si el token no es válido
        }
      };
      verifyToken();
    }
  }, [token]);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      // Guardar token en localStorage y estado
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      // Redirigir al usuario a la página privada
      navigate('/private');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Credenciales inválidas.');
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;

      // Guardar token en localStorage y estado
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      // Redirigir al usuario a la página privada
      navigate('/private');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new Error('Error al registrar usuario.');
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpiar token y datos del usuario
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);

    // Redirigir al usuario a la página pública
    navigate('/');
  };

  // Valor del contexto
  const value = {
    user,
    token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
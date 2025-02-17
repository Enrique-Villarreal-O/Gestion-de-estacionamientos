import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Proveedor de autenticación
import PublicRoutes from './pages/public/PublicRoutes'; // Rutas públicas
import PrivateRoutes from './pages/private/PrivateRoutes'; // Rutas privadas

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/*" element={<PublicRoutes />} />

          {/* Rutas privadas */}
          <Route path="/private/*" element={<PrivateRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
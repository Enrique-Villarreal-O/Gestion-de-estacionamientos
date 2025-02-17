import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../services/api'; // Importar Axios configurado
import { useAuth } from '../../contexts/AuthContext'; // Contexto de autenticación

const Home = () => {
  const [parkings, setParkings] = useState([]); // Estado para almacenar los estacionamientos
  const { user } = useAuth(); // Obtener datos del usuario autenticado

  // Cargar las últimas ofertas de estacionamientos disponibles
  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await axios.get('/api/parkings/?available=true');
        setParkings(response.data);
      } catch (error) {
        console.error('Error al cargar los estacionamientos:', error);
      }
    };

    fetchParkings();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Últimas Ofertas de Estacionamientos</h1>

      {/* Lista de estacionamientos */}
      <div className="row">
        {parkings.length > 0 ? (
          parkings.map((parking) => (
            <div key={parking._id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={parking.images[0]}
                  alt={parking.description}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{parking.description}</h5>
                  <p className="card-text">
                    <strong>Precio por hora:</strong> ${parking.pricePerHour}
                  </p>
                  <p className="card-text">
                    <strong>Ubicación:</strong> {parking.location}
                  </p>
                  {user ? (
                    <Link to={`/private/rent/${parking._id}`} className="btn btn-primary">
                      Alquilar
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-primary">
                      Inicia sesión para alquilar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No hay estacionamientos disponibles.</p>
        )}
      </div>

      {/* Opciones para registro e inicio de sesión */}
      <div className="text-center mt-4">
        {!user && (
          <>
            <Link to="/register" className="btn btn-success me-2">
              Registrarse
            </Link>
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
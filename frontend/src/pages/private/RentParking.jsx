import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { acceptRentalOffer } from '../../services/parking.service';

const RentParking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offerData, setOfferData] = useState({
    pricePerHour: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setOfferData({ ...offerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await acceptRentalOffer(id, offerData);
      alert('Oferta enviada exitosamente.');
      navigate('/private');
    } catch (error) {
      console.error(error);
      alert('Error al enviar la oferta.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Enviar Oferta de Alquiler</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="pricePerHour" className="form-label">
            Precio por Hora
          </label>
          <input
            type="number"
            className="form-control"
            id="pricePerHour"
            name="pricePerHour"
            value={offerData.pricePerHour}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">
            Fecha de Inicio
          </label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={offerData.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">
            Fecha de Fin
          </label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            name="endDate"
            value={offerData.endDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Enviar Oferta
        </button>
      </form>
    </div>
  );
};

export default RentParking;
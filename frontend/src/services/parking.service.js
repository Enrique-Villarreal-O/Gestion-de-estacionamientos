import api from './api'; // Importar la instancia de Axios configurada

// Función para listar estacionamientos
export const listParkings = async (filters = {}) => {
  try {
    const response = await api.get('/parkings', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error al listar los estacionamientos:', error);
    throw new Error('Error al obtener los estacionamientos.');
  }
};

// Función para crear un nuevo estacionamiento
export const createParking = async (parkingData) => {
  try {
    const formData = new FormData();
    for (const key in parkingData) {
      if (key === 'files') {
        // Agregar archivos al FormData
        parkingData[key].forEach((file) => {
          formData.append('files', file);
        });
      } else {
        // Agregar otros campos al FormData
        formData.append(key, parkingData[key]);
      }
    }

    const response = await api.post('/parkings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el estacionamiento:', error);
    throw new Error('Error al crear el estacionamiento.');
  }
};

// Función para actualizar un estacionamiento
export const updateParking = async (id, parkingData) => {
  try {
    const response = await api.put(`/parkings/${id}`, parkingData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el estacionamiento:', error);
    throw new Error('Error al actualizar el estacionamiento.');
  }
};

// Función para eliminar un estacionamiento
export const deleteParking = async (id) => {
  try {
    const response = await api.delete(`/parkings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el estacionamiento:', error);
    throw new Error('Error al eliminar el estacionamiento.');
  }
};

// Función para aceptar una oferta de alquiler
export const acceptRentalOffer = async (id, offerData) => {
  try {
    const response = await api.post(`/parkings/${id}/accept-offer`, offerData);
    return response.data;
  } catch (error) {
    console.error('Error al aceptar la oferta de alquiler:', error);
    throw new Error('Error al aceptar la oferta de alquiler.');
  }
};
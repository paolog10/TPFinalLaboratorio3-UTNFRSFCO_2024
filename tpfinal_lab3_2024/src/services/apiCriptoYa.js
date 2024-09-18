import axios from "axios";

const apiCriptoYa = axios.create({
  baseURL: "https://criptoya.com/api/argenbtc",
});

export const obtenerPrecios = async (endpoint) => {
  try {
    const response = await apiCriptoYa.get(endpoint);
    return response.data; 
  } catch (error) {
    console.error('Error al obtener los precios:', error);
    throw error;
  }
};

export default apiCriptoYa
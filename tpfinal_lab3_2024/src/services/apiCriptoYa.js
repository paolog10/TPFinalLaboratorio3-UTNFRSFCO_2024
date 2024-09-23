import axios from "axios";

const apiCriptoYa = axios.create({
  baseURL: "https://criptoya.com/api/argenbtc",
});

const endpointsPrecios = [
  "/btc/ars/1", 
  "/eth/ars/1",
  "/usdt/ars/1", 
  "/dai/ars/1"
];

export const obtenerPrecios = async () => {
  try {
    const preciosPromises = endpointsPrecios.map((endpoint) =>
      apiCriptoYa.get(endpoint)
    );
    const precios = await Promise.all(preciosPromises);
    return precios.map((response) => response.data);
  } catch (error) {
    console.error("Error al obtener los precios:", error);
    throw error;
  }
};

export default apiCriptoYa
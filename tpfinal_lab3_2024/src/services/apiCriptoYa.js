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
  const precios = [];

  for (const endpoint of endpointsPrecios) {
    try {
      //Espero a que cada precio sea obtenido
      const respuesta = await apiCriptoYa.get(endpoint);
      
      precios.push(respuesta.data);
    } catch (error) {
      console.error(`Error al obtener el precio del endpoint ${endpoint}:`, error);
    }
  }

  return precios;
};

export const obtenerPrecioAskCripotmoneda = async (criptomoneda) => {
  try {
    const response = await apiCriptoYa.get(`/${criptomoneda}/ARS/1`);
    
    const precioAsk = response.data.ask;
    console.log(`Precio ask de ${criptomoneda}:`, precioAsk);
    
    return precioAsk;
  } catch (error) {
    console.error(`Error al obtener el precio ask de ${criptomoneda}:`, error);
    throw error;
  }
};

export const obtenerPrecioBidCriptomoneda = async (criptomoneda) => {
  try {
    const response = await apiCriptoYa.get(`/${criptomoneda}/ARS/1`);
    
    const precioBid = response.data.bid;
    console.log(`Precio bid de ${criptomoneda}:`, precioBid);
    
    return precioBid;
  } catch (error) {
    console.error(`Error al obtener el precio bid de ${criptomoneda}:`, error);
    throw error;
  }
};

//Pantalla Estado Actual y Analisis de Inversiones, obtengo el precio de venta + comision
export const obtenerPrecioTotalBidCriptomoneda = async (criptomoneda) => {
  try {
    const response = await apiCriptoYa.get(`/${criptomoneda}/ARS/1`);
    
    const precioTotalBid = response.data.totalBid;
    console.log(`Precio totalBid de ${criptomoneda}:`, precioTotalBid);
    
    return precioTotalBid;
  } catch (error) {
    console.error(`Error al obtener el precio totalBid de ${criptomoneda}:`, error);
    throw error;
  }
};

export default apiCriptoYa
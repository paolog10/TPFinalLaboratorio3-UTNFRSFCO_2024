import axios from "axios";

/* 
profe - Esto ayuda a que si se recarga la página, no se pierdan los datos (ya que son almacenados en una Base de Datos)
*/

// const apiClient = axios.create({
//   baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
//   headers: {'x-apikey': '60eb09146661365596af552f'}
// });

const apiClient = axios.create({
  baseURL: "https://labor3-d60e.restdb.io/rest/",
  headers: { "x-apikey": "64a2e9bc86d8c525a3ed8f63" },
});

export const nuevaCompra = async (datosCompra) => {
  try {
    let response = await apiClient.post('transactions', datosCompra);
    console.log("response: ", response)
  } catch (error) {
    console.error('Error al comprar, intente nuevamente', error);
  } 
};

export const nuevaVenta = async (datosCompra) => {
  try {
    let response = await apiClient.post('transactions', datosCompra);
    console.log("response: ", response)
  } catch (error) {
    console.error('Error al vender, intente nuevamente', error);
  } 
};

export const obtenerTodasTransacciones = async (clienteId) => {
  try {
    const response = await apiClient.get(`transactions?q={"user_id":"${clienteId}"}`);
    console.log("response: ", response)
    return response.data;
  } catch (error) {
    console.error('Error al obtener transacciones, intente nuevamente ', error);
  }
};

export default apiClient
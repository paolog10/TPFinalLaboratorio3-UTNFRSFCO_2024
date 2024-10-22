import axios from "axios";

/* 
profe - Esto ayuda a que si se recarga la página, no se pierdan los datos (ya que son almacenados en una Base de Datos)
*/

// const apiClient = axios.create({
//   baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
//   headers: {'x-apikey': '60eb09146661365596af552f'}
// });

// const apiClient = axios.create({
//   baseURL: "https://labor3-d60e.restdb.io/rest/",
//   headers: { "x-apikey": "64a2e9bc86d8c525a3ed8f63" },
// });

const apiClient = axios.create({
  baseURL: "https://laboratorio3-5459.restdb.io/rest/",
  headers: {"x-apikey": "64a57c2b86d8c50fe6ed8fa5"}
});

export const nuevaCompra = async (datosCompra) => {
  let response = await apiClient.post('transactions', datosCompra);
  return response;
};

export const nuevaVenta = async (datosCompra) => {
  let response = await apiClient.post('transactions', datosCompra);
  return response;
};

export const obtenerTodasTransacciones = async (clienteId) => {
  const response = await apiClient.get(`transactions?q={"user_id":"${clienteId}"}`);
  return response.data;
};

export const eliminarTransaccion = async (_id) => {
  const response = await apiClient.delete(`/transactions/${_id}`);
  return response;
};

export const editarTransaccion = async (id, data) => {
  const response = await apiClient.patch(`/transactions/${id}`, data);
  return response;
};

export default apiClient
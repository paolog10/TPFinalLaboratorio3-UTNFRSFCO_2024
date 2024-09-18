import axios from "axios";

/* 
profe - Esto ayuda a que si se recarga la página, no se pierdan los datos (ya que son almacenados en una Base de Datos)
*/

const apiClient = axios.create({
  baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
  headers: {'x-apikey': '60eb09146661365596af552f'}
});

export default apiClient
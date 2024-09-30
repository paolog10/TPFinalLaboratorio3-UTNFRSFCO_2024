<template>
  <div>
    <h1>Historial de Movimientos de: {{ clienteId }}</h1>

    <div 
      v-if="historialMovimientos.length === 0"
      class="spinner-container"
    >
      <LoadingSpinner />
    </div>
  
    <div v-else>
      <table class="tabla-precios-criptomonedas">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Precio Pagado $ARS</th>
            <th>Compra/Venta</th>
            <th>Fecha/Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(movimiento, id) in historialMovimientos" :key="id">
            <td>{{ movimiento.crypto_code }}</td>
            <td>{{ movimiento.crypto_amount }}</td>
            <td>{{ movimiento.money }}</td>
            <td>{{ movimiento.action === 'purchase' ? 'Compra' : 'Venta' }}</td>
            <td>{{ new Date(movimiento.datetime).toLocaleDateString() }} {{ new Date(movimiento.datetime).toLocaleTimeString() }}</td>
            <td>
              <button>Ver</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button
        type="button"
        class="btn-cancelar"
        @click="redirijirPantallaPrincipal"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script>
import { obtenerTodasTransacciones } from '../services/apiClient';
import LoadingSpinner from './LoadingSpinner.vue';

export default {
  name: 'HistorialMovimientos',

  components: {
    LoadingSpinner
  },
  
  data() {
    return {
      clienteId: localStorage.getItem('idUsuario'),
      historialMovimientos: [] // Este array debe llenarse con los datos de las transacciones
    };
  },

  async mounted() {
    try {
      console.log("clienteId: ", this.clienteId);
      const resultadosTransacciones = await obtenerTodasTransacciones(this.clienteId);
      this.historialMovimientos = resultadosTransacciones;
      console.log("Transacciones obtenidas: ", resultadosTransacciones);
    } catch (error) {
      console.error("Error al obtener las transacciones: ", error);
    }
  },

  methods: {
    redirijirPantallaPrincipal() {
      this.$router.push('/panel');
    }
  }

};
</script>

<style scoped>
.tabla-precios-criptomonedas {
  max-width: 50%;
  margin: 20px auto;
  border-collapse: collapse;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
  font-size: 14px;
  margin: 20px 0;
}

th {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

td {
  padding: 10px;
  text-align: center;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

tr:hover td {
  background-color: #c8e4c3;
}

button {
  padding: 5px 10px;
  background-color: #017BFE;
  border: none;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #005bb5;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Altura completa de la pantalla */
}

.btn-cancelar {
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; 
  margin: 0 5px; 
}

.btn-cancelar {
  background-color: #ff9800;
}

.btn-cancelar:hover {
  background-color: #fb8c00;
}
</style>


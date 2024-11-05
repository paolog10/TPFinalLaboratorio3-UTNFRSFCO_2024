<template>
  <div class="card-container">
    <div 
      v-if="transaccion"
      class="card"
    >
      <p><strong>Criptomoneda:</strong> {{ transaccion.crypto_code}}</p>
      <p><strong>Accion:</strong> {{ transaccion.action === 'purchase' ? 'Compra' : 'Venta' }}</p>
      <p><strong>Cantidad:</strong> {{ transaccion.crypto_amount }}</p>
      <p><strong>Precio:</strong> {{ transaccion.money }}</p>
      <p><strong>Fecha:</strong> {{ new Date(transaccion.datetime).toLocaleDateString() }} {{ new Date(transaccion.datetime).toLocaleTimeString() }}</p>
      <button 
        @click="volver"
        class="btn-volver"  
      >
        Volver
      </button>
    </div>
    
    <div 
      v-else
      class="spinner-container"  
    >
      <LoadingSpinner />
    </div>

  </div>
</template>

<script>
  import { obtenerTransaccion } from '../services/apiClient';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';

  export default {
    name: "HistorialMovimientosDetalleView",

    components: {
      LoadingSpinner,
    },

    props: {
      id: {
        type: String,
        required: true,
      }
    },
    
    data(){
      return {
        transaccion: null,
      }
    },

    methods:{
      volver() {
        this.$router.push('/historialMovimientos');
      },

      async fetchTransaccion(){
        try {
          const resultadoTransaccion = await obtenerTransaccion(this.id);
          console.log("resultadoTransaccion: ", resultadoTransaccion)
          this.transaccion = resultadoTransaccion;

        } catch (e) {
          console.error("Error al obtener transaccion");
        }
      },

    },

    mounted() {
      this.fetchTransaccion();
    },
    
  }
</script>

<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  background-color: #c8e4c3;
  border: 1px solid #ccc; 
  border-radius: 4px; 
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  width: 300px; 
}

.card p {
  margin: 10px 0; 
}



.btn-volver {
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; 
  margin: 0 5px; 
}

.btn-volver {
  background-color: #ff9800;
}

.btn-volver:hover {
  background-color: #fb8c00;
}

.cargando {
  text-align: center;
  font-size: 18px;
  color: #888;
}
</style>
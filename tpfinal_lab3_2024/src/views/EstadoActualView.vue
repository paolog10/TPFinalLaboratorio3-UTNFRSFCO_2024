<template>
  <div>
    
    <h1>Estado Actual</h1>

    <div 
      v-if="this.criptomonedas.length === 0 && !datosCargados" 
      class="spinner-container"
    >
      <LoadingSpinner />
    </div>

    <div
      v-else-if="this.criptomonedas.length === 0 && datosCargados"
      class="no-criptomonedas-container"
    >
      <p>No hay criptomonedas, por favor, compre alguna para ver datos.</p>
    </div>

    <div
      v-else
    >
      
      <table class="tabla-precios-criptomonedas">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Dinero</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(criptomoneda, index) in criptomonedas" :key="index">
            <td>{{ criptomoneda.crypto_code }}</td>
            <td>{{ criptomoneda.crypto_amount.toFixed(2) }}</td>
            <td>$ {{ criptomoneda.money.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <CarteraGraficoView 
        :criptomonedas="criptomonedas"
      />
      
    </div>

    <button
      type="button"
      class="btn-cancelar"
      @click="volverAtras"
    >
      Volver
    </button>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { obtenerTodasTransacciones } from '../services/apiClient';
import { obtenerPrecioTotalBidCriptomoneda } from '../services/apiCriptoYa';
import CarteraGraficoView from './CarteraGraficoView.vue';


export default {
  name: 'EstadoActualView',

  components: {
    LoadingSpinner,
    CarteraGraficoView
  },

  data() {
    return {
      clienteId: localStorage.getItem('idUsuario'),
      criptomonedas: [],
      totalDinero: 0,
      datosCargados: false,
    }
  },

  async mounted() {
    try {
      const response = await obtenerTodasTransacciones(this.clienteId);
      console.log('response:', response);
      
      this.procesarTransacciones(response);
    } catch (error) {
      console.error('Error al obtener las transacciones:', error);
    } finally {
      this.datosCargados = true;
    }
  },

  methods: {
    //Objetivo: unir las transacciones según criptomoneda y sumar o restar cantidades según su accion
    async procesarTransacciones(transacciones) {
      // Recorre las transacciones y ajusta las cantidades.
      for (let i = 0; i < transacciones.length; i++) {
        const { crypto_code, crypto_amount, action } = transacciones[i];
        const amount = parseFloat(crypto_amount);

        // Busca si la criptomoneda ya está en el array.
        let criptomoneda = this.criptomonedas.find(c => c.crypto_code === crypto_code);

        if (!criptomoneda) {
          // Si no existe, agrega un nuevo objeto con la criptomoneda y cantidad inicial 0.
          criptomoneda = { crypto_code, crypto_amount: 0, money: 0 };
          this.criptomonedas.push(criptomoneda);
        }

        // Actualiza el valor dependiendo de la acción.
        if (action === 'purchase') {
          criptomoneda.crypto_amount += amount;
        } else if (action === 'sale') {
          criptomoneda.crypto_amount -= amount;
        }
      }

      // Luego de ajustar las cantidades, obtenemos el precio totalBid para cada criptomoneda.
      for (let i = 0; i < this.criptomonedas.length; i++) {
        const criptomoneda = this.criptomonedas[i];

        if (criptomoneda.crypto_amount > 0) {
          try {
            let responseTotalBid = await obtenerPrecioTotalBidCriptomoneda(criptomoneda.crypto_code);

            //Si es undefined, se establece en 0.
            responseTotalBid = responseTotalBid || 0;

            //Calcula el valor en dinero.
            criptomoneda.money = criptomoneda.crypto_amount * responseTotalBid;
          } catch (error) {
            console.error(`Error al obtener el totalBid para ${criptomoneda.crypto_code}:`, error);
            criptomoneda.money = 0;
          }
        } else {
          // Si la cantidad es 0 o negativa, la establecemos a 0.
          criptomoneda.money = 0;
        }
      }
    },

    volverAtras() {
      this.$router.push('/panel');
    },

  }
};

</script>

<style scoped>
.no-criptomonedas-container {
  text-align: center;
  margin: 20px;
  font-size: 20px;
  color: #ff0000;
}

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

.btn-eliminar{
  background-color: red;
  color: black;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-eliminar:hover {
  background-color: #d83939;
}

.boton-editar-transaccion {
  background-color: yellow;
  color: black;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

</style>

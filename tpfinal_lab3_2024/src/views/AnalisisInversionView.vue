<template>
  <div>
    <h2>Análisis de Inversiones</h2>

    <div 
      v-if="this.resultados.length === 0" 
      class="spinner-container"
    >
      <LoadingSpinner />
    </div>

    <div
      v-else
    >
      <table class="tabla-precios-criptomonedas">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(resultado, i) in resultados" :key="i">
            <td>{{ resultado.crypto_code.toUpperCase() }}</td>
            <!--Venta - Compra-->
            <td 
              :class="resultado.money > 0 ? 'positivo' : 'negativo'"
            >
              {{ resultado.money > 0 ? '+ ' : '- ' }}$ {{ resultado.money.toFixed(2) * -1 }}
            </td>
          </tr>
        </tbody>
      </table><br>
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
import { obtenerPrecioTotalBidCriptomoneda } from '@/services/apiCriptoYa';
import { obtenerTodasTransacciones } from '../services/apiClient';


export default {
  name: 'AnalisisInversionView',

  data() {
    return {
      resultados: [],
      clienteId: localStorage.getItem('idUsuario')
    };
  },

  components: {
    LoadingSpinner,
  },

  methods:{
    volverAtras() {
      this.$router.push('/panel');
    },

    async procesarInversion(transacciones) {
      for (let i = 0; i < transacciones.length; i++) {
        const { crypto_code, crypto_amount, money, action } = transacciones[i];
        const amount = parseFloat(crypto_amount);
        const monto = parseFloat(money);

        //Buscamos la criptomoneda en los resultados
        let criptomoneda = this.resultados.find(c => c.crypto_code === crypto_code);

        //Si no existe, crea una nueva entrada
        if (!criptomoneda) {
          criptomoneda = { 
            crypto_code, 
            totalCompra: 0, 
            totalVenta: 0, 
            crypto_amount: 0, 
            money: 0 
          };
          
          this.resultados.push(criptomoneda);
        }

        //Actualiza según la acción (compra o venta)
        if (action === 'purchase') {
          criptomoneda.totalCompra += monto;
          criptomoneda.crypto_amount += amount;
        } else if (action === 'sale') {
          criptomoneda.totalVenta += monto;
          criptomoneda.crypto_amount -= amount;
        }
      }

      //Calculamos el valor actual y el dinero total para cada criptomoneda
      for (let i = 0; i < this.resultados.length; i++) {
        const criptomoneda = this.resultados[i];
        console.log("criptomoneda: ", criptomoneda)

        try {
          const responseTotalBid = await obtenerPrecioTotalBidCriptomoneda(criptomoneda.crypto_code);
          let valorActual = criptomoneda.crypto_amount * responseTotalBid;
          console.log("criptomoneda.crypto_amount: ", criptomoneda.crypto_amount)

          //// si la cantidad de cripto es 0, valor actual es 0 porque criptomoneda.crypto_amount = 0
          if (valorActual === 0) {
            criptomoneda.money = criptomoneda.totalVenta - criptomoneda.totalCompra;
          } else {
            criptomoneda.money = valorActual + criptomoneda.totalVenta - criptomoneda.totalCompra;
          }
        } catch (error) {
          console.error(`Error al obtener el totalBid para ${criptomoneda.crypto_code}:`, error);
          criptomoneda.money = 0;
        }
      }
    },

  },

  async mounted() {
    try {
      const response = await obtenerTodasTransacciones(this.clienteId);
      console.log('response en AnalisisInversionView:', response);
      
      this.procesarInversion(response);
    } catch (error) {
      console.error('Error al obtener las transacciones:', error);
    }
  },
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

.positivo {
  color: green;
}

.negativo {
  color: red;
}

.btn-cancelar {
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #ff9800;
}

.btn-cancelar:hover {
  background-color: #fb8c00;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Altura completa de la pantalla */
}
</style>

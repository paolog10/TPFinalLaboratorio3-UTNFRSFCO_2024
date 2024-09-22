<template>
  <div class="panel">
    <nav class="barra-navegacion">
      <div>
        <span>{{ darMensajeBienvenida }}</span>
        <router-link to="/comprar-vender" class="comprar-vender">
          Comprar/Vender
        </router-link>
      </div>
      <button 
        @click="cerrarSesion" 
        class="btn-cerrar-sesion"
      >
        Cerrar sesión
      </button>
    </nav>

    <div>
      <h1>Panel de Criptomonedas</h1>
    </div>

    <div 
      v-if="preciosCriptomonedas.length === 0"
      class="spinner-container"
    >
      <LoadingSpinner />
    </div>

    <div v-else class="tabla-precios-criptomonedas">
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Precio de compra $ARS</th>
            <th>Precio de venta $ARS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(precioCriptomoneda, index) in preciosCriptomonedas" :key="index">
            <td><img :src="iconosCriptomonedas[index]" alt=""></td>
            <td>{{ precioCriptomoneda.ask }}</td>
            <td>{{ precioCriptomoneda.bid }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '../components/LoadingSpinner';
import { obtenerPrecios } from '@/services/apiCriptoYa';
import { useToast } from 'vue-toastification';

export default {
  components: {
    LoadingSpinner
  },

  data(){
    return{
      esLoguedo: false,
      clienteId: localStorage.getItem('idUsuario'),
      iconosCriptomonedas: [
        "https://argenbtc.com/img/iconos/f_bitcoin.svg",
        "https://argenbtc.com/img/iconos/f_ethereum.svg",
        "https://argenbtc.com/img/iconos/f_tether.svg",
        "https://argenbtc.com/img/iconos/f_dai.svg",
      ],
      endpointsPrecios: [
        "/btc/ars/1", 
        "/eth/ars/1",
        "/usdt/ars/1", 
        "/dai/ars/1"
      ],
      preciosCriptomonedas: [],
    }
  },

  methods: {
    cerrarSesion() {
      localStorage.removeItem('idUsuario');
      this.$router.push({ name: 'loginView' });
    },

    async obtenerPrecios() {
      const toast = useToast();

      try {
        for (const endpoint of this.endpointsPrecios) {
          let precioCriptomoneda = await obtenerPrecios(endpoint);
          this.preciosCriptomonedas.push(precioCriptomoneda);
        }
      } catch (error) {
        toast.error('Error al obtener los precios de las criptomonedas');
      }
    },
  },

  computed:{
    darMensajeBienvenida(){
      let usuarioId = localStorage.getItem('idUsuario');
      return `Bienvenido ${usuarioId}!!!`;
    }
  },

  mounted(){
    let usuarioId = localStorage.getItem('idUsuario');
    if (usuarioId) {
      this.esLoguedo = true;
    }
  },

  created(){
    this.obtenerPrecios();
  }
}
</script>

<style scoped>
.panel{
  padding: 20px;
}

.barra-navegacion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f2f2f2;
  padding: 10px 20px;
  font-weight: bold;
}

.btn-cerrar-sesion {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.tabla-precios-criptomonedas {
  max-width: 600px;
  margin: 0 auto;
}

table {
  font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
  font-size: 12px;
  margin: 45px;
  width: 480px;
  text-align: center;
  border-collapse: collapse;
}

th {
  font-size: 13px;
  font-weight: normal;
  padding: 8px;
  background: #4caf50;
  border-top: 4px solid #77b87f;
  border-bottom: 1px solid #fff;
}

td {
  padding: 8px;
  background: #e4f0df;
  border-bottom: 1px solid #fff;
  border-top: 1px solid transparent;
}

tr:hover td {
  background: #c8e4c3;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Altura completa de la pantalla */
}

.comprar-vender {
  text-decoration: none;
  color: #4caf50;
}
</style>

<!--
created: Se ejecuta cuando el componente es creado (antes de estar en el DOM). Útil para iniciar datos o hacer peticiones API.
mounted: Se ejecuta después de que el componente ha sido añadido al DOM. Útil para interacciones con el DOM.
computed: Son propiedades derivadas que se calculan de forma eficiente y reactiva, y se actualizan solo cuando los datos que dependen de ellas cambian.
-->
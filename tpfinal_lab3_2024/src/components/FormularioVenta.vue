<template>
  <div>
    <h1>Formulario de venta</h1>
    <div class="formulario-venta">
      <form @submit.prevent="realizarVenta">
        <div>
          <label>Cantidad:</label>
          <input 
            type="text" 
            id="cantidad" 
            v-model.number="cantidadVentaCriptomoneda" 
            placeholder="Ej: 10.05 si quiere una porción de criptomoneda"
          >
        </div>

        <div>
          <label>Criptomoneda:</label>
          <select id="criptomoneda" 
            v-model="criptomonedaSeleccionada"
            @change="obtenerPrecio"
          > 
            <option disabled selected>Selecciona criptomoneda</option>
            <option value="BTC">Bitcoin</option>
            <option value="ETH">Ethereum</option>
            <option value="UDST">USDT</option>
            <option value="DAI">Dai</option>
          </select>
        </div>

        <button 
          type="submit" 
          class="btn-venta"
        > 
          Vender
        </button>
        <button
          type="reset"
          class="btn-reset"
          @click="resetFormulario"
        >
          Refrescar
        </button>
        <button
          type="button"
          class="btn-cancelar"
          @click="cancelarVenta"
        >
          Cancelar
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import { nuevaVenta } from '../services/apiClient';
import { obtenerPrecioBidCriptomoneda } from "../services/apiCriptoYa";

export default {
  name: 'FormularioCompra',
  data() {
    return {
      cantidadVentaCriptomoneda: null,
      criptomonedaSeleccionada: '',
      ventaExitosa: false,
      errorVenta: null,
      clienteId: localStorage.getItem('idUsuario'),
      precioBid: null
    }
  },

  methods: {
    async realizarVenta() { 
      const toast = useToast();     
      let cantidadParseada = parseFloat(this.cantidadVentaCriptomoneda);

      let esFormularioCorrecto = 
        !isNaN(cantidadParseada) && 
        cantidadParseada > 0 &&
        this.criptomonedaSeleccionada;

      if (!esFormularioCorrecto) {
        if (isNaN(cantidadParseada) || cantidadParseada <= 0) {
          this.errorVenta = 'Debe ingresar una cantidad válida.';
        } else if (!this.criptomonedaSeleccionada) {
          this.errorVenta = 'Debe seleccionar una criptomoneda.';
        }
        toast.error(this.errorVenta);
        this.ventaExitosa = false;
        this.resetFormulario();
        return;
      }

      let ventaCriptomoneda = {
        user_id: this.clienteId,
        action: "sale",
        crypto_code: this.criptomonedaSeleccionada,
        crypto_amount: cantidadParseada,
        money: (this.precioBid * cantidadParseada).toFixed(2),
        datetime: new Date().toISOString()
      };
      console.log("ventaCriptomoneda: ", ventaCriptomoneda);
      try {
        const resultado = await nuevaVenta(ventaCriptomoneda);
        this.ventaExitosa = true;
        toast.success(`Venta exitosa: ${resultado}`);

        this.$router.push('/historialMovimientos');
        this.resetFormulario();
      } catch (error) {
        toast.error(`Error al realizar la compra: ${error.message}`);
      }

    },

    async obtenerPrecio() {
      try {
        const precio = await obtenerPrecioBidCriptomoneda(this.criptomonedaSeleccionada);
        
        if (precio) {
          this.precioBid = precio;
          console.log(`Precio Bid obtenido: ${precio}`);
        } else {
          console.error('No se pudo obtener el precio');
        }
      } catch (error) {
        this.errorVenta = `Error al obtener el precio de la criptomoneda: ${error.message}`;
        console.error(this.errorVenta);
      }
    },
    
    resetFormulario() {
      this.cantidadVentaCriptomoneda = "";
      this.criptomonedaSeleccionada = "";
    },

    cancelarVenta() {
      this.$router.push('/panel');
    }
  },

}
</script>

<style scoped>
.formulario-venta {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.btn-venta, .btn-reset, .btn-cancelar {
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; 
  margin: 0 5px; 
}

.btn-venta {
  background-color: #4CAF50;
}

.btn-venta:hover {
  background-color: #45a049;
}

.btn-reset {
  background-color: #f44336;
}

.btn-reset:hover {
  background-color: #d32f2f;
}

.btn-cancelar {
  background-color: #ff9800;
}

.btn-cancelar:hover {
  background-color: #fb8c00;
}

/* Alinear los botones horizontalmente */
.botones {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

input,
select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

form {
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.exito {
  color: green;
}
</style>
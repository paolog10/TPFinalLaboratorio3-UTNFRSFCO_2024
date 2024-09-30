<template>
  <div>
    <h1>Formulario de compra</h1>
    <div class="formularioCompra">
      <form @submit.prevent="realizarCompra">
        <div>
          <label>Cantidad:</label>
          <input 
            type="text" 
            id="cantidad" 
            v-model.number="cantidadCompraCriptomoneda" 
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
          class="botonCompra"
        > 
          Comprar
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
          @click="cancelarCompra"
        >
          Cancelar
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import { nuevaCompra } from '../services/apiClient';
import { obtenerPrecioAskCriptomoneda } from "../services/apiCriptoYa";

export default {
  name: 'FormularioCompra',
  data() {
    return {
      cantidadCompraCriptomoneda: null,
      criptomonedaSeleccionada: '',
      compraExitosa: false,
      errorCompra: null,
      clienteId: localStorage.getItem('idUsuario'),
      precioAsk: null
    }
  },

  methods: {
    async realizarCompra() { 
      const toast = useToast();     
      let cantidadParseada = parseFloat(this.cantidadCompraCriptomoneda);

      let esFormularioCorrecto = 
        !isNaN(cantidadParseada) && 
        cantidadParseada > 0 &&
        this.criptomonedaSeleccionada;

      if (!esFormularioCorrecto) {
        if (isNaN(cantidadParseada) || cantidadParseada <= 0) {
          this.errorCompra = 'Debe ingresar una cantidad válida.';
        } else if (!this.criptomonedaSeleccionada) {
          this.errorCompra = 'Debe seleccionar una criptomoneda.';
        }
        toast.error(this.errorCompra);
        this.compraExitosa = false;
        this.resetFormulario();
        return;
      }

      let compraCriptomoneda = {
        user_id: this.clienteId,
        action: "purchase",
        crypto_code: this.criptomonedaSeleccionada,
        crypto_amount: cantidadParseada,
        money: (this.precioAsk * cantidadParseada).toFixed(2),
        datetime: new Date().toISOString() //formato iso
      };

      try {
        const resultado = await nuevaCompra(compraCriptomoneda);
        this.compraExitosa = true;
        toast.success(`Compra exitosa: ${resultado}`);

        this.$router.push('/historialMovimientos'); //redirijo
        this.resetFormulario();
      } catch (error) {
        toast.error(`Error al realizar la compra: ${error.message}`);
      }

    },

    async obtenerPrecio() {
      try {
        const precio = await obtenerPrecioAskCriptomoneda(this.criptomonedaSeleccionada);
        
        if (precio) {
          this.precioAsk = precio;
          console.log(`Precio ask obtenido: ${precio}`);
        } else {
          console.error('No se pudo obtener el precio');
        }
      } catch (error) {
        this.errorCompra = `Error al obtener el precio de la criptomoneda: ${error.message}`;
        console.error(this.errorCompra);
      }
    },
    
    resetFormulario() {
      this.cantidadCompraCriptomoneda = "";
      this.criptomonedaSeleccionada = "";
    },

    cancelarCompra() {
      this.$router.push('/panel');
    }
  },

}
</script>

<style scoped>
.formularioCompra {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.botonCompra, .btn-reset, .btn-cancelar {
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; 
  margin: 0 5px; 
}

.botonCompra {
  background-color: #4CAF50;
}

.botonCompra:hover {
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
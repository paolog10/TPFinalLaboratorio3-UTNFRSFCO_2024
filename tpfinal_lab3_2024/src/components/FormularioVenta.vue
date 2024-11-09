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
import { nuevaVenta, obtenerTodasTransacciones } from '../services/apiClient';
import { obtenerPrecioBidCriptomoneda } from "../services/apiCriptoYa";

export default {
  name: 'FormularioVenta',

  data() {
    return {
      cantidadVentaCriptomoneda: null,
      criptomonedaSeleccionada: '',
      ventaExitosa: false,
      errorVenta: null,
      clienteId: localStorage.getItem('idUsuario'),
      precioBid: null,
      criptomonedas: [] 
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

      //traigo la cartera del cliente
      const cartera = await obtenerTodasTransacciones(this.clienteId);
      console.log("cartera: ", cartera)

      this.procesarTransacciones(cartera);

      const cantidadDisponible = this.criptomonedas.find(
        c => c.crypto_code === this.criptomonedaSeleccionada
      )?.crypto_amount || 0; // Cambiar para obtener la cantidad de criptomonedas ? si es undefined
      console.log("cantidadDisponible: ", cantidadDisponible)

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

      if (cantidadParseada > cantidadDisponible) {
        this.errorVenta = `No puedes vender más de ${cantidadDisponible} ${this.criptomonedaSeleccionada} o no tiene esa cantidad para vender. Verifique`;
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
        console.log(resultado)
        toast.success(`Venta exitosa!`);

        this.$router.push('/historialMovimientos');
        this.resetFormulario();
      } catch (error) {
        toast.error(`Error al realizar la compra: ${error.message}`);
      }

    },

    //Sumo las cantidades nomás
    procesarTransacciones(transacciones) {
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
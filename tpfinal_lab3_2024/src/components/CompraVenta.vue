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
          > 
            <option disabled selected>Selecciona criptomoneda</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="tether">USDT</option>
            <option value="dai">Dai</option>
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
          @click="resetInput"
        >
          Refrescar
        </button>
        
        <p v-if="compraExitosa" class="exito">Compra con éxito.</p>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';

export default {
  name: 'CompraVenta',
  data() {
    return {
      cantidadCompraCriptomoneda: null,
      criptomonedaSeleccionada: '',
      compraExitosa: false,
      errorCompra: null,
      clienteId: localStorage.getItem('idUsuario'),
    }
  },

  methods: {
    realizarCompra() { 
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
        this.resetInput();
        return;
      }

      let compraCriptomoneda = {
        user_id: this.clienteId,
        action: "purchase",
        crypto_code: this.criptomonedaSeleccionada,
        crypto_amount: cantidadParseada,
        money: "btc",
        datetime: new Date().toISOString() //formato iso
      };
      console.log(compraCriptomoneda);
      this.compraExitosa = true;
      toast.success(`Compra de ${cantidadParseada} ${this.criptomonedaSeleccionada} realizada con éxito!`);
      this.resetInput();

    },

    resetInput() {
      this.cantidadCompraCriptomoneda = "";
      this.criptomonedaSeleccionada = "";
    },

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

.botonCompra {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.botonCompra:hover {
  background-color: #45a049;
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

.btn-reset {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>


<template>

  <div 
    v-if="mostrarFormulario"
    class="formularioCompra"
  >

    <h2>Formulario Editar Transacción</h2>
    
    <form @submit.prevent="guardarCambios">
      
      <!-- <div>
        <label for="crypto_code">Criptomoneda:</label>
        <input 
          type="text" 
          v-model="formularioEdicion.crypto_code" 
          id="crypto_code" 
          disabled 
        />
      </div> -->

      <div>
        <label for="crypto_amount">Cantidad: </label>
        <input 
          type="text" 
          v-model="formularioEdicion.crypto_amount" 
          id="crypto_amount"
          placeholder="Ingrese cantidad" 
          required 
        />
      </div>
      <br>

      <!-- <div>
        <label for="money">Precio Pagado $ARS:</label>
        <input 
          type="text" 
          v-model="formularioEdicion.money" 
          id="money" 
          disabled 
        />
      </div> -->

      <button 
        type="submit"
        class="btn-compra
        "
      >
        Guardar Cambios
      </button>
      
      <button
        @click="cancelarEdicion"
        class="btn-cancelar"
      >
        Cancelar
      </button>

    </form>
  </div>
</template>

<script>

export default {
  name: 'FormularioEdicion',
  
  props: {
    datosEdicion: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      mostrarFormulario: false,
      formularioEdicion: {
        money: this.datosEdicion.money,
        crypto_code: this.datosEdicion.crypto_code,
        crypto_amount: this.datosEdicion.crypto_amount,
      },
    };
  },

  watch: {
    datosEdicion: {
      handler(newData) {
        if (newData.edicion) {
          this.formularioEdicion = { ...newData };
          this.mostrarFormulario = true;
        }
      },
    },
  },
  
  methods: {
    guardarCambios() {
      this.$emit('guardar-edicion', { ...this.formularioEdicion });
      this.mostrarFormulario = false;
    },

    cancelarEdicion() {
      this.mostrarFormulario = false;
      this.$emit('cancelar-edicion');
    },
  },
};
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

.btn-compra, .btn-cancelar {
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; 
  margin: 0 5px; 
}

.btn-compra {
  background-color: #4CAF50;
}

.btn-compra:hover {
  background-color: #45a049;
}

.btn-cancelar {
  background-color: #ff9800;
}

.btn-cancelar:hover {
  background-color: #fb8c00;
}

</style>

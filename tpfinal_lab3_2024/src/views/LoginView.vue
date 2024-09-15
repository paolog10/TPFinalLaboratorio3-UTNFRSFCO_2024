<template>
  <section class="pantalla-login">
    <div class="login"> 

      <div class="titulo-wallet">
        <h1>@MyBitWallet</h1>
      </div>

      <form 
        @submit.prevent="onLogin" 
        class="formulario"
      >
        <label class="title">Ingrese Id Usuario</label>
        
        <input 
          v-model="idUsuario" 
          id="id-usuario" 
          type="text" 
          class="input"
        />
        
        <button 
          id="id-boton-login" 
          type="submit" 
          class="boton-login"
        >
          Ingresar
        </button>

        <p 
          v-show="errorIdUsuario" 
          class="error-validacion-id-usuario"
        >
          Revise ID, redirigiendo...Espere
        </p>

      </form>
    </div>
  </section>
</template>


<script>
  
  export default {
    data() {
      return{
        idUsuario: '',
        errorIdUsuario: false,
      }
    },
    
    computed: {
      
    },
    
    methods:{
      
      onLogin () {
        let longitudLogin = 10;
        const esValido = this.idUsuario.length === longitudLogin && /^[a-zA-Z0-9]+$/.test(this.idUsuario);

        if (esValido) {
          localStorage.setItem('idUsuario', this.idUsuario);
          //this.$router.push({ name: "MainView" }); 
        } else {
          this.errorIdUsuario = true;
          this.idUsuario = '';

          setTimeout(() => {
            this.errorIdUsuario = false; // Ocultamos el mensaje de error
            this.$router.push({ name: "LoginView" });
          }, 3000);
        }
      },
    }
  }
</script>

<style scoped>
  .pantalla-login{
    height:95vh;
  }
  
  .login{
    height: 100%;
    display: flex; 
    flex-direction: column;
    align-items: center;
    justify-content: center; /*alinea al centro ambos ejes*/
    background-color: none;
    background-image: url("../assets/fondo.jpg");
    background-size: auto; 
  }
  
  .formulario {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    border: black 2px solid;
  }
  
  .title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
  }
  
  .input {
    width: 250px;
    height: 20px;
    padding: 8px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .boton-login {
    width: 120px;
    height: 40px;
    background-color: #4caf50;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .boton-login:hover {
    background-color: #45a049;
  }

  .logo-wallet{
    height: 40px;
    width: 40px;
  }

  .error-validacion-id-usuario {
    color: red;
    margin-top: 12px;
    font-weight: bold;
  }

  .titulo-wallet {
    font-size: xx-large;
    padding-bottom: 80px;
  }

</style>

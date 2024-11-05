<template>
  <div class="chart-wrapper">
    <PieChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  components: {
    PieChart: Pie,
  },
  
  props: {
    criptomonedas: {
      type: Array,
      required: true,
    },
  },
  
  computed: {
    chartData() {
      return {
        labels: this.criptomonedas.map(item => item.crypto_code.toUpperCase()),
        datasets: [
          {
            data: this.criptomonedas.map(item => item.money),
            backgroundColor: [
              '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'
            ],
          },
        ],
      };
    },
    
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      };
    },
  },
};
</script>

<style scoped>
.chart-wrapper {
  max-width: 200px; 
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 200px; 
}

canvas {
  max-width: 100% !important; /* Asegura que el gráfico se ajuste al contenedor */
  height: auto !important;
}
</style>


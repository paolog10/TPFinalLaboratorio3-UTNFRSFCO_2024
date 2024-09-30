import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PanelView from '../views/PanelView.vue'
import FormularioCompra from '../components/FormularioCompra.vue'
import HistorialMovimientos from '../components/HistorialMovimientos.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // },
  {
    path: '/',
    name: 'loginView',
    component: LoginView
  },
  {
    path: '/panel',
    name: 'panelView',
    component: PanelView
  },
  {
    path: '/comprar',
    name: 'compra',
    component: FormularioCompra
  },
  {
    path: '/historialMovimientos',
    name: 'HistorialMovimientos',
    component: HistorialMovimientos
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

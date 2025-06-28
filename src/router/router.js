import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/incomes',
    name: 'incomes',
    component: () => import('../views/IncomesView.vue'),
    meta: { endpoint: 'incomes' },
    props: true
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
    metta: {endpont: 'orders'},
    props: true
  },
  {
    path: '/sales',
    name: 'sales',
    component: () => import('../views/SalesView.vue'),
    meta: {endpoint: 'sales' },
    props: true
  },
  {
    path: '/stocks',
    name: 'stocks',
    component: () => import('../views/StocksView.vue'),
    meta: {endpoint: 'stocks' },
    props: true
  },
  {
    path: '/',
    redirect: '/orders'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

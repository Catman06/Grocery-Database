import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'table',
      component: () => import('../views/TableView.vue')
    },
    {
      path: '/scanner',
      name: 'scanner',
      component: () => import('../views/ScannerView.vue')
    }
  ]
})

export default router

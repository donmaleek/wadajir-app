import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/ParentLanding.vue'), // Use ParentLanding to handle modals
    meta: { requiresAuth: false },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.checkAuth() // Restore auth state from localStorage

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to landing page if not authenticated
    next('/')
  } else if (to.name === 'Landing' && authStore.isAuthenticated) {
    // Redirect authenticated user away from landing page
    next('/home')
  } else {
    next()
  }
})

export default router

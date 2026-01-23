import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/ParentLanding.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/trade',
    name: 'Trade',
    component: () => import('../views/TradePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transfer',
    name: 'Transfer',
    component: () => import('../views/InternalTransfer.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/membership',
    name: 'Membership',
    component: () => import('../views/MembershipUpgrade.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/invest',
    name: 'Invest',
    component: () => import('../views/InvestmentDashboard.vue'),
    meta: { requiresAuth: true },
  },
  // ❌ REMOVED FORGOT PASSWORD ROUTE - Using modal instead
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory('/wadajir-app/'),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (localStorage.getItem('isLoggingOut')) {
    console.log('🛑 Router guard detected logout in progress, allowing navigation to landing')
    localStorage.removeItem('isLoggingOut')
    if (to.name !== 'Landing') {
      return next({ name: 'Landing' })
    }
    return next()
  }

  const hasUserInLocalStorage =
    localStorage.getItem('golden_rise_user') ||
    localStorage.getItem('registeredUser') ||
    localStorage.getItem('wadajir_users') ||
    localStorage.getItem('currentUser')

  const isAuthenticated = authStore.isAuthenticated || hasUserInLocalStorage

  console.log('🔐 ROUTE GUARD DEBUG:', {
    to: to.fullPath,
    requiresAuth: to.meta?.requiresAuth,
    isAuthenticated,
    hasUserInLocalStorage: !!hasUserInLocalStorage,
    authStoreState: authStore.isAuthenticated,
  })

  if (to.meta?.requiresAuth && !isAuthenticated) {
    console.log('🔒 Access denied to protected route:', to.path)
    return next({ name: 'Landing' })
  }

  if (to.name === 'Landing' && isAuthenticated) {
    console.log('🏠 Already logged in, redirecting to home')
    return next({ name: 'Home' })
  }

  console.log('✅ Navigation allowed to:', to.path)
  return next()
})

export default router

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
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ GLOBAL AUTH GUARD WITH LOGOUT FIX
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // ✅ CHECK 1: If we're in the middle of logging out, allow navigation to landing
  if (localStorage.getItem('isLoggingOut')) {
    console.log('🛑 Router guard detected logout in progress, allowing navigation to landing')
    localStorage.removeItem('isLoggingOut')
    // If trying to go anywhere but landing, redirect to landing
    if (to.name !== 'Landing') {
      return next({ name: 'Landing' })
    }
    return next()
  }

  // ✅ CHECK 2: Check if user data exists in localStorage (more reliable)
  const hasUserInLocalStorage =
    localStorage.getItem('golden_rise_user') ||
    localStorage.getItem('registeredUser') ||
    localStorage.getItem('wadajir_users') ||
    localStorage.getItem('currentUser')

  // ✅ CHECK 3: Use auth store state
  const isAuthenticated = authStore.isAuthenticated || hasUserInLocalStorage

  console.log('🔐 ROUTE GUARD DEBUG:', {
    to: to.fullPath,
    requiresAuth: to.meta?.requiresAuth,
    isAuthenticated,
    hasUserInLocalStorage: !!hasUserInLocalStorage,
    authStoreState: authStore.isAuthenticated,
  })

  // ✅ 1. Protect private routes
  if (to.meta?.requiresAuth && !isAuthenticated) {
    console.log('🔒 Access denied to protected route:', to.path)
    return next({ name: 'Landing' })
  }

  // ✅ 2. Prevent logged-in users from visiting landing page (unless logging out)
  if (to.name === 'Landing' && isAuthenticated) {
    console.log('🏠 Already logged in, redirecting to home')
    return next({ name: 'Home' })
  }

  // ✅ 3. Allow navigation
  console.log('✅ Navigation allowed to:', to.path)
  return next()
})

export default router

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // =========================
  // STATE
  // =========================
  const isAuthenticated = ref(false)

  const currentUser = ref({
    name: '',
    email: '',
    id: '',
    token: '',
  })

  // =========================
  // INIT AUTH (CALLED FROM main.js)
  // =========================
  const initAuth = () => {
    try {
      const savedUser = localStorage.getItem('golden_rise_user')

      if (savedUser) {
        const user = JSON.parse(savedUser)

        currentUser.value = {
          name: user.name || '',
          email: user.email || '',
          id: user.id || '',
          token: user.token || '',
        }

        isAuthenticated.value = !!user.token
      } else {
        isAuthenticated.value = false
      }
    } catch (err) {
      console.error('Auth init error:', err)
      isAuthenticated.value = false
    }
  }

  // =========================
  // GETTERS
  // =========================
  const userInitial = computed(() =>
    currentUser.value.name ? currentUser.value.name.charAt(0).toUpperCase() : 'U',
  )

  const userDisplayName = computed(
    () => currentUser.value.name || currentUser.value.email || 'Trader',
  )

  const hasUserName = computed(
    () => !!currentUser.value.name && currentUser.value.name.trim().length > 0,
  )

  // =========================
  // ACTIONS
  // =========================
  const login = (userData) => {
    try {
      const user = {
        name: userData.name || '',
        email: userData.email || '',
        id: userData.id || Date.now().toString(),
        token: userData.token || `token_${Date.now()}`,
      }

      currentUser.value = user
      isAuthenticated.value = true

      localStorage.setItem('golden_rise_user', JSON.stringify(user))

      return { success: true, user }
    } catch (err) {
      console.error('Login error:', err)
      return { success: false, error: err.message }
    }
  }

  const logout = () => {
    currentUser.value = { name: '', email: '', id: '', token: '' }
    isAuthenticated.value = false

    localStorage.removeItem('golden_rise_user')
    localStorage.removeItem('userBalance')
    localStorage.removeItem('pendingDeposit')
    sessionStorage.clear()

    return { success: true }
  }

  const updateUser = (userData) => {
    try {
      currentUser.value = { ...currentUser.value, ...userData }
      localStorage.setItem('golden_rise_user', JSON.stringify(currentUser.value))
      return { success: true }
    } catch (err) {
      console.error('Update user error:', err)
      return { success: false, error: err.message }
    }
  }

  // =========================
  // CHECK AUTH (USED BY ROUTER)
  // =========================
  const checkAuth = () => {
    return isAuthenticated.value
  }

  return {
    isAuthenticated,
    currentUser,
    userInitial,
    userDisplayName,
    hasUserName,
    initAuth, // ✅ important
    login,
    logout,
    updateUser,
    checkAuth, // ✅ important
  }
})

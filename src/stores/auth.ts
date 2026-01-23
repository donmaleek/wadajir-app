// src/stores/auth.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface User {
  name: string
  email: string
  id: string
  token: string
}

interface LoginResponse {
  success: boolean
  user?: User
  error?: string
}

interface UpdateResponse {
  success: boolean
  error?: string
}

export const useAuthStore = defineStore('auth', () => {
  // =========================
  // STATE
  // =========================
  const isAuthenticated = ref(false)

  const currentUser = ref<User>({
    name: '',
    email: '',
    id: '',
    token: '',
  })

  // =========================
  // INIT AUTH (CALLED FROM main.js)
  // =========================
  const initAuth = (): void => {
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
        console.log('🔐 Auth initialized from localStorage:', currentUser.value)
      } else {
        isAuthenticated.value = false
        console.log('🔐 No saved user found, auth not initialized')
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
  const login = (userData: Partial<User>): LoginResponse => {
    try {
      const user: User = {
        name: userData.name || '',
        email: userData.email || '',
        id: userData.id || Date.now().toString(),
        token: userData.token || `token_${Date.now()}`,
      }

      currentUser.value = user
      isAuthenticated.value = true

      localStorage.setItem('golden_rise_user', JSON.stringify(user))
      console.log('🔐 User logged in:', user)

      return { success: true, user }
    } catch (err) {
      console.error('Login error:', err)
      return { success: false, error: (err as Error).message }
    }
  }

  const logout = (): { success: boolean } => {
    currentUser.value = { name: '', email: '', id: '', token: '' }
    isAuthenticated.value = false

    localStorage.removeItem('golden_rise_user')
    localStorage.removeItem('userBalance')
    localStorage.removeItem('pendingDeposit')
    sessionStorage.clear()

    console.log('🔐 User logged out')
    return { success: true }
  }

  const updateUser = (userData: Partial<User>): UpdateResponse => {
    try {
      currentUser.value = { ...currentUser.value, ...userData }
      localStorage.setItem('golden_rise_user', JSON.stringify(currentUser.value))
      console.log('🔐 User updated:', currentUser.value)
      return { success: true }
    } catch (err) {
      console.error('Update user error:', err)
      return { success: false, error: (err as Error).message }
    }
  }

  // =========================
  // CHECK AUTH (USED BY ROUTER)
  // =========================
  const checkAuth = (): boolean => {
    return isAuthenticated.value
  }

  return {
    // State
    isAuthenticated,
    currentUser,

    // Getters
    userInitial,
    userDisplayName,
    hasUserName,

    // Actions
    initAuth,
    login,
    logout,
    updateUser,
    checkAuth,
  }
})

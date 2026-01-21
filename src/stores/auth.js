import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const isAuthenticated = ref(false)
  const currentUser = ref({
    name: '',
    email: '',
    id: '',
    token: '',
  })

  // User initial for avatar circle
  const userInitial = computed(() => {
    return currentUser.value.name ? currentUser.value.name.charAt(0).toUpperCase() : 'U'
  })

  // Login user + save into localStorage
  const login = (userData) => {
    currentUser.value = { ...userData }
    isAuthenticated.value = true

    // Store safely in localStorage
    localStorage.setItem('golden_rise_user', JSON.stringify(userData))
  }

  // Logout user + clear storage + redirect
  const logout = async () => {
    currentUser.value = { name: '', email: '', id: '', token: '' }
    isAuthenticated.value = false

    // Remove saved data
    localStorage.removeItem('golden_rise_user')

    // Safely redirect to landing page
    try {
      await router.push('/')
    } catch (err) {
      console.error('Logout redirect error:', err)
    }
  }

  // Load user from localStorage when app loads
  const checkAuth = () => {
    const savedUser = localStorage.getItem('golden_rise_user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      currentUser.value = user
      isAuthenticated.value = true
    }
  }

  return {
    isAuthenticated,
    currentUser,
    userInitial,
    login,
    logout,
    checkAuth,
  }
})

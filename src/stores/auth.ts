import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  name: string
  email: string
  id: string
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false)

  const currentUser = ref<User>({
    name: '',
    email: '',
    id: '',
  })

  const userInitial = computed(() => {
    return currentUser.value.name ? currentUser.value.name.charAt(0).toUpperCase() : 'U'
  })

  const login = (userData: User) => {
    currentUser.value = { ...userData }
    isAuthenticated.value = true
    localStorage.setItem('golden_rise_user', JSON.stringify(userData))
  }

  const logout = () => {
    currentUser.value = { name: '', email: '', id: '' }
    isAuthenticated.value = false
    localStorage.removeItem('golden_rise_user')
  }

  const checkAuth = () => {
    const savedUser = localStorage.getItem('golden_rise_user')
    if (savedUser) {
      const user: User = JSON.parse(savedUser)
      login(user)
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

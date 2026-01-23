// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Create app
const app = createApp(App)

// Create and register Pinia FIRST
const pinia = createPinia()
app.use(pinia)

// Register router
app.use(router)

// Mount the app
app.mount('#app')

// ✅ Initialize auth AFTER app is mounted
// This ensures the Pinia instance is fully ready
import { useAuthStore } from './stores/auth'

// Use setTimeout to ensure DOM is ready
setTimeout(() => {
  try {
    const authStore = useAuthStore()
    console.log('🚀 Initializing auth store...')
    authStore.initAuth()
    console.log('✅ Auth initialized:', {
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.currentUser,
    })
  } catch (error) {
    console.error('❌ Failed to initialize auth:', error)
  }
}, 100)

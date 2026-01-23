import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

import { useAuthStore } from './stores/auth'

// Create app
const app = createApp(App)

// Create Pinia
const pinia = createPinia()

// Register Pinia
app.use(pinia)

// ✅ IMPORTANT: pass pinia instance to store
const authStore = useAuthStore(pinia)
authStore.initAuth()

// Register router AFTER auth init
app.use(router)

// Mount app
app.mount('#app')

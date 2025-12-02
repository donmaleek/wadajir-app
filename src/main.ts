import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // Add this import
import './style.css'

// Create app and Pinia instance
const app = createApp(App)
const pinia = createPinia()

// Use Pinia and Router before mounting
app.use(pinia)
app.use(router) // Add this line

// Mount the app
app.mount('#app')

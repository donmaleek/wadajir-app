<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

// Components
import RainbowBackground from './components/common/RainbowBackground.vue'
import RegisterModal from './components/auth/RegisterModal.vue'
import LoginModal from './components/auth/LoginModal.vue'
import Toast from './components/layout/Toast.vue'
import ModernAIAgent from './components/ai/ModernAIAgent.vue'

// Router
const router = useRouter()

// Initialize store
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

// UI state
const showRegisterModal = ref(false)
const showLoginModal = ref(false)
const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

// AI Service state
const showAIChat = ref(false)

// Methods
const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const handleRegisterSuccess = (userData) => {
  authStore.login(userData)
  showRegisterModal.value = false
  showToast('Account created successfully! Welcome to Golden Rise!')
  router.push({ name: 'home' })
}

const handleLoginSuccess = (userData) => {
  authStore.login(userData)
  showLoginModal.value = false
  showToast('Welcome back!')
  router.push({ name: 'home' })
}

const handleServiceClick = () => {
  showAIChat.value = true
  showToast('AI Service Assistant is available!')
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Watch for authentication changes and redirect
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'landing' })
  }
})

// Lifecycle
onMounted(() => {
  authStore.checkAuth()
  if (isAuthenticated.value) {
    router.push({ name: 'home' })
  }
})
</script>

<template>
  <div id="app" class="w-full h-full">
    <RainbowBackground />

    <!-- FIXED: Changed to camelCase event listeners -->
    <RouterView
      @showRegister="showRegisterModal = true"
      @showLogin="showLoginModal = true"
      @showService="handleServiceClick"
    />

    <ModernAIAgent :show="showAIChat" @update:show="showAIChat = $event" />

    <RegisterModal
      v-if="showRegisterModal"
      @close="showRegisterModal = false"
      @switch-to-login="switchToLogin"
      @success="handleRegisterSuccess"
    />

    <LoginModal
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @switch-to-register="switchToRegister"
      @success="handleLoginSuccess"
    />

    <Toast
      v-if="toast.show"
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @update:show="toast.show = $event"
    />
  </div>
</template>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}
</style>

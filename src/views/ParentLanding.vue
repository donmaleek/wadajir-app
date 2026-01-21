<template>
  <div class="parent-landing-container">
    <!-- Debug Panel (temporary) -->
    <div class="debug-panel" v-if="showDebug">
      <div class="debug-content">
        <h3>Debug Panel</h3>
        <p>Login Visible: {{ loginVisible }}</p>
        <p>Register Visible: {{ registerVisible }}</p>
        <p>Service Visible: {{ serviceVisible }}</p>
        <div class="debug-buttons">
          <button @click="openLogin" class="debug-btn">Show Login</button>
          <button @click="openRegister" class="debug-btn">Show Register</button>
          <button @click="toggleDebug" class="debug-btn">Hide Debug</button>
        </div>
      </div>
    </div>

    <!-- Landing Page -->
    <LandingPage
      @showLogin="openLogin"
      @showRegister="openRegister"
      @showService="openService"
      ref="landingRef"
    />

    <!-- Login Modal -->
    <LoginModal
      v-if="loginVisible"
      @close="loginVisible = false"
      @switchToRegister="switchToRegister"
      @success="handleLoginSuccess"
    />

    <!-- Register Modal -->
    <RegisterModal
      v-if="registerVisible"
      @close="registerVisible = false"
      @switchToLogin="switchToLogin"
      @success="handleRegisterSuccess"
    />

    <!-- Service Modal -->
    <ServiceModal v-if="serviceVisible" @close="serviceVisible = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LandingPage from '../views/LandingView.vue'
import LoginModal from '../components/auth/LoginModal.vue'
import RegisterModal from '../components/auth/RegisterModal.vue'
import ServiceModal from '../components/auth/ServiceModal.vue'

const router = useRouter()
const authStore = useAuthStore()

/* Modal states */
const loginVisible = ref(false)
const registerVisible = ref(false)
const serviceVisible = ref(false)
const showDebug = ref(true)

/* Refs */
const landingRef = ref(null)

/* Toggle debug panel */
const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

/* Modal open handlers */
const openLogin = () => {
  console.log('🔵 ParentLanding: openLogin')
  loginVisible.value = true
  registerVisible.value = false
  serviceVisible.value = false
}

const openRegister = () => {
  console.log('🟢 ParentLanding: openRegister')
  registerVisible.value = true
  loginVisible.value = false
  serviceVisible.value = false
}

const openService = () => {
  console.log('🟡 ParentLanding: openService')
  serviceVisible.value = true
  loginVisible.value = false
  registerVisible.value = false
}

/* Switch handlers */
const switchToRegister = () => {
  loginVisible.value = false
  registerVisible.value = true
}

const switchToLogin = () => {
  registerVisible.value = false
  loginVisible.value = true
}

/* Login success */
const handleLoginSuccess = (userData) => {
  console.log('✅ Login success', userData)

  authStore.login(userData) // ❗ NO await
  loginVisible.value = false

  nextTick(() => {
    router.push('/home')
  })
}

/* Register success */
const handleRegisterSuccess = (userData) => {
  console.log('✅ Register success', userData)

  authStore.login(userData) // ❗ NO await
  registerVisible.value = false

  nextTick(() => {
    router.push('/home')
  })
}

/* Logout */
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

/* Watch auth state (debug + safety) */
watch(
  () => authStore.isAuthenticated,
  (v) => {
    console.log('🔐 Auth state changed →', v)
    if (v) {
      router.push('/home')
    }
  },
)

/* Lifecycle */
onMounted(() => {
  console.log('🚀 ParentLanding mounted')
  console.log('Landing ref:', landingRef.value)
})
</script>

<style scoped>
.parent-landing-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Debug Panel */
.debug-panel {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #6366f1;
  border-radius: 12px;
  padding: 16px;
  z-index: 9999;
  color: white;
  font-family: monospace;
  max-width: 300px;
}
</style>

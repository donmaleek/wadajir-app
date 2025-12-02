<template>
  <div>
    <!-- Landing Page -->
    <LandingPage @showLogin="openLogin" @showRegister="openRegister" @showService="openService" />

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
    />

    <!-- Service Modal -->
    <ServiceModal v-if="serviceVisible" @close="serviceVisible = false" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
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

/* Modal open handlers */
const openLogin = () => {
  loginVisible.value = true
  registerVisible.value = false
  serviceVisible.value = false
}
const openRegister = () => {
  registerVisible.value = true
  loginVisible.value = false
  serviceVisible.value = false
}
const openService = () => {
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
const handleLoginSuccess = async (userData) => {
  try {
    await authStore.login(userData)
    loginVisible.value = false
    setTimeout(() => router.push('/home'), 150)
  } catch (error) {
    console.error('Login handling error:', error)
  }
}

/* Logout */
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

/* Listen for forced logout */
watch(
  () => authStore.forceLogoutEvent,
  (triggered) => {
    if (triggered) {
      handleLogout()
      authStore.clearLogoutEvent()
    }
  },
)
</script>

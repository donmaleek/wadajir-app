<template>
  <div class="parent-landing-container">
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

/* Refs */
const landingRef = ref(null)

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
const handleLoginSuccess = (userData) => {
  authStore.login(userData)
  loginVisible.value = false

  nextTick(() => {
    router.push('/home')
  })
}

/* Register success */
const handleRegisterSuccess = (userData) => {
  authStore.login(userData)
  registerVisible.value = false

  nextTick(() => {
    router.push('/home')
  })
}

/* Watch auth state */
watch(
  () => authStore.isAuthenticated,
  (v) => {
    if (v) {
      router.push('/home')
    }
  },
)

/* Lifecycle */
onMounted(() => {
  console.log('ParentLanding mounted')
})
</script>

<style scoped>
.parent-landing-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>

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
      @switchToForgotPassword="openForgotPassword"
      @success="handleLoginSuccess"
    />

    <!-- Register Modal -->
    <RegisterModal
      v-if="registerVisible"
      @close="registerVisible = false"
      @switchToLogin="switchToLogin"
      @success="handleRegisterSuccess"
    />

    <!-- Forgot Password Modal -->
    <ForgotPasswordModal
      v-if="forgotPasswordVisible"
      @close="forgotPasswordVisible = false"
      @switch-to-login="switchFromForgotToLogin"
      @go-to-landing="handleGoToLanding"
    />

    <!-- Service Modal -->
    <ServiceModal v-if="serviceVisible" @close="serviceVisible = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LandingPage from '../views/LandingView.vue'
import LoginModal from '../components/auth/LoginModal.vue'
import RegisterModal from '../components/auth/RegisterModal.vue'
import ForgotPasswordModal from '../views/ForgotPassword.vue'
import ServiceModal from '../components/auth/ServiceModal.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

/* Modal states */
const loginVisible = ref(false)
const registerVisible = ref(false)
const forgotPasswordVisible = ref(false)
const serviceVisible = ref(false)

/* Refs */
const landingRef = ref(null)

/* Modal open handlers */
const openLogin = () => {
  loginVisible.value = true
  registerVisible.value = false
  forgotPasswordVisible.value = false
  serviceVisible.value = false
}

const openRegister = () => {
  registerVisible.value = true
  loginVisible.value = false
  forgotPasswordVisible.value = false
  serviceVisible.value = false
}

const openForgotPassword = () => {
  forgotPasswordVisible.value = true
  loginVisible.value = false
  registerVisible.value = false
  serviceVisible.value = false
}

const openService = () => {
  serviceVisible.value = true
  loginVisible.value = false
  registerVisible.value = false
  forgotPasswordVisible.value = false
}

/* Switch handlers */
const switchToRegister = () => {
  loginVisible.value = false
  registerVisible.value = true
  forgotPasswordVisible.value = false
}

const switchToLogin = () => {
  registerVisible.value = false
  loginVisible.value = true
  forgotPasswordVisible.value = false
}

const switchFromForgotToLogin = () => {
  forgotPasswordVisible.value = false
  loginVisible.value = true
}

/* Handle go to landing from forgot password */
const handleGoToLanding = () => {
  forgotPasswordVisible.value = false

  // If we're on the forgot password route, navigate back to landing
  if (route.path === '/forgot-password') {
    router.push('/')
  }

  // Optionally, scroll to top of landing page
  if (landingRef.value) {
    landingRef.value.scrollToTop?.()
  }
}

/* Login success */
const handleLoginSuccess = (userData) => {
  authStore.login(userData)
  loginVisible.value = false
  registerVisible.value = false
  forgotPasswordVisible.value = false
  serviceVisible.value = false

  nextTick(() => {
    router.push('/home')
  })
}

/* Register success */
const handleRegisterSuccess = (userData) => {
  authStore.login(userData)
  registerVisible.value = false
  loginVisible.value = false
  forgotPasswordVisible.value = false
  serviceVisible.value = false

  nextTick(() => {
    router.push('/home')
  })
}

/* Check URL for forgot password on mount */
onMounted(() => {
  console.log('ParentLanding mounted')

  // Check if we're on the forgot password route
  if (route.path === '/forgot-password') {
    // Open forgot password as modal when accessing via direct route
    openForgotPassword()
  } else {
    // Check URL for forgot password parameter (for modal persistence)
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('forgot-password') === 'true') {
      openForgotPassword()
    }

    // Check localStorage for persistent state
    const savedForgotState = localStorage.getItem('showForgotPassword')
    if (savedForgotState === 'true') {
      openForgotPassword()
    }
  }
})

// Save state to localStorage when forgot password modal opens/closes
watch(forgotPasswordVisible, (newValue) => {
  if (newValue) {
    localStorage.setItem('showForgotPassword', 'true')
    // Only update URL if we're not already on the route
    if (route.path !== '/forgot-password') {
      const url = new URL(window.location)
      url.searchParams.set('forgot-password', 'true')
      window.history.replaceState({}, '', url)
    }
  } else {
    localStorage.removeItem('showForgotPassword')
    // Only remove from URL if we're not on the route
    if (route.path !== '/forgot-password') {
      const url = new URL(window.location)
      url.searchParams.delete('forgot-password')
      window.history.replaceState({}, '', url)
    }
  }
})

// Clean up on unmount
onBeforeUnmount(() => {
  localStorage.removeItem('showForgotPassword')
})

/* Watch auth state */
watch(
  () => authStore.isAuthenticated,
  (v) => {
    if (v) {
      // Close all modals if authenticated
      loginVisible.value = false
      registerVisible.value = false
      forgotPasswordVisible.value = false
      serviceVisible.value = false
      router.push('/home')
    }
  },
)

/* Watch route changes to handle navigation properly */
watch(
  () => route.path,
  (newPath) => {
    // If user navigates away from forgot password route, close the modal
    if (newPath !== '/forgot-password' && forgotPasswordVisible.value) {
      forgotPasswordVisible.value = false
    }

    // If user navigates to landing page, close all modals
    if (newPath === '/') {
      loginVisible.value = false
      registerVisible.value = false
      forgotPasswordVisible.value = false
      serviceVisible.value = false
    }
  },
)
</script>

<style scoped>
.parent-landing-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>

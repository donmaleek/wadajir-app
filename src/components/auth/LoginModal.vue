<template>
  <!-- Remove teleport, render directly in parent -->
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- Close Button -->
      <button class="close-button" @click="$emit('close')">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Logo -->
      <div class="modal-logo-container">
        <div class="tech-ring ring-1"></div>
        <div class="tech-ring ring-2"></div>

        <div class="rainbow-border-circle">
          <div class="logo-inner">
            <span class="logo-text">GR</span>
          </div>
        </div>

        <div class="orbital-dot"></div>
      </div>

      <!-- Title -->
      <h3 class="modal-title">Welcome Back</h3>
      <p class="modal-subtitle">Sign in to access your AI trading dashboard</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-fields">
          <div class="input-group">
            <label class="input-label">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="text-input"
              placeholder="Enter your email"
              :disabled="loading"
            />
            <i class="fa-solid fa-envelope input-icon"></i>
          </div>

          <div class="input-group">
            <label class="input-label">Password</label>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="text-input"
              placeholder="Enter your password"
              :disabled="loading"
            />
            <i class="fa-solid fa-lock input-icon"></i>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
              :disabled="loading"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="login-options">
            <label class="remember-label">
              <input type="checkbox" v-model="rememberMe" :disabled="loading" />
              <span class="remember-text"> Remember me </span>
            </label>

            <button
              type="button"
              @click="$emit('showForgotPassword')"
              class="forgot-password-btn"
              :disabled="loading"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <div class="modal-buttons">
          <button type="submit" :disabled="loading || !isFormValid" class="rainbow-button">
            <span v-if="loading" class="button-loading">
              <i class="fa-solid fa-spinner fa-spin"></i>
              Signing In...
            </span>
            <span v-else class="button-text">
              <i class="fa-solid fa-right-to-bracket"></i>
              Sign In
            </span>
          </button>

          <div class="auth-switch">
            <p>
              Don't have an account?
              <a href="#" @click.prevent="$emit('switchToRegister')" class="switch-link">
                Create Account
              </a>
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <i class="fa-solid fa-circle-exclamation"></i>
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['close', 'success', 'switchToRegister', 'showForgotPassword'])

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

/* ================================
   📦 User Validation
================================ */
const getRegisteredUsers = () => {
  try {
    const users = localStorage.getItem('goldenrise_users')
    return users ? JSON.parse(users) : []
  } catch {
    return []
  }
}

const isFormValid = computed(() => {
  return form.value.email && form.value.password
})

/* ================================
   🔑 Login Logic
================================ */
const handleLogin = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getRegisteredUsers()
    const user = users.find((u) => u.email === form.value.email)

    if (!user) {
      throw new Error('No account found with this email. Please register first.')
    }

    // Compare passwords
    if (user.password && form.value.password !== user.password) {
      throw new Error('Invalid email or password')
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      balance: user.balance || 0,
      membership: user.membership || 'Basic',
      hasDeposited: user.hasDeposited || false,
    }

    // Save to session
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        ...userData,
        rememberMe: rememberMe.value,
        lastLogin: new Date().toISOString(),
      }),
    )

    // Update user last login
    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, lastLogin: new Date().toISOString() } : u,
    )
    localStorage.setItem('goldenrise_users', JSON.stringify(updatedUsers))

    // Emit success
    emit('success', userData)

    // Clear form
    form.value = { email: '', password: '' }
    showPassword.value = false
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

/* ================================
   🔄 Restore Remember Me
================================ */
onMounted(() => {
  const savedUser = localStorage.getItem('currentUser')

  if (savedUser) {
    try {
      const user = JSON.parse(savedUser)
      if (user.rememberMe) {
        form.value.email = user.email
        rememberMe.value = true
      }
    } catch (error) {
      console.error('Error parsing saved user:', error)
    }
  }
})
</script>

<style scoped>
/* Modal Overlay - Fixed for overlay above content */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 5, 16, 0.9);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
  box-sizing: border-box;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: #0f0f23;
  border-radius: 24px;
  width: 100%;
  max-width: min(480px, 90vw);
  max-height: min(90vh, 800px);
  padding: clamp(24px, 5vw, 40px) clamp(20px, 4vw, 32px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 32px 64px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 0 80px -20px rgba(99, 102, 241, 0.2);
  position: relative;
  background:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.05) 0%, transparent 50%), #0f0f23;
  overflow-y: auto;
}

/* Reuse all other styles from the register modal */
.close-button {
  position: absolute;
  top: clamp(16px, 3vw, 20px);
  right: clamp(16px, 3vw, 20px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  width: clamp(32px, 6vw, 36px);
  height: clamp(32px, 6vw, 36px);
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  font-size: clamp(14px, 3vw, 16px);
  z-index: 10;
}

.close-button:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  transform: rotate(90deg);
  border-color: rgba(239, 68, 68, 0.4);
}

/* Logo Container */
.modal-logo-container {
  position: relative;
  width: clamp(80px, 20vw, 100px);
  height: clamp(80px, 20vw, 100px);
  margin: 0 auto clamp(20px, 4vw, 24px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  animation: spin-reverse 20s linear infinite;
}

.ring-1 {
  inset: clamp(-6px, -1.5vw, -8px);
  opacity: 0.3;
}

.ring-2 {
  inset: clamp(-12px, -3vw, -16px);
  opacity: 0.1;
  animation-duration: 30s;
}

.rainbow-border-circle {
  position: relative;
  width: 100%;
  height: 100%;
  background: #050510;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.rainbow-border-circle::before {
  content: '';
  position: absolute;
  inset: clamp(-2px, -0.5vw, -3px);
  border-radius: 50%;
  padding: clamp(2px, 0.5vw, 3px);
  background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: spin 4s linear infinite;
}

.logo-inner {
  width: clamp(64px, 16vw, 80px);
  height: clamp(64px, 16vw, 80px);
  background: #050510;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #374151;
  box-shadow: inset 0 2px 8px 0 rgba(0, 0, 0, 0.2);
}

.logo-text {
  font-size: clamp(32px, 8vw, 40px);
  font-weight: 700;
  background: linear-gradient(
    to right,
    #ff0000,
    #ff7f00,
    #ffff00,
    #00ff00,
    #0000ff,
    #4b0082,
    #8f00ff
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shine 5s linear infinite;
  padding-top: clamp(2px, 0.5vw, 4px);
}

.orbital-dot {
  position: absolute;
  top: 0;
  left: 50%;
  width: clamp(2px, 0.5vw, 3px);
  height: clamp(2px, 0.5vw, 3px);
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 8px white;
  transform: translateX(-50%);
  animation: orbit 3s linear infinite;
}

/* Titles */
.modal-title {
  font-size: clamp(24px, 6vw, 28px);
  font-weight: 600;
  text-align: center;
  color: white;
  margin: 0 0 clamp(6px, 1.5vw, 8px) 0;
  letter-spacing: 0.025em;
  line-height: 1.2;
}

.modal-subtitle {
  text-align: center;
  color: #9ca3af;
  margin: 0 0 clamp(24px, 6vw, 32px) 0;
  font-size: clamp(13px, 3vw, 14px);
  font-weight: 400;
  line-height: 1.4;
}

/* Form */
.login-form {
  width: 100%;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 4vw, 20px);
  margin-bottom: clamp(20px, 5vw, 24px);
}

.input-group {
  position: relative;
}

.input-label {
  display: block;
  margin-bottom: clamp(6px, 1.5vw, 8px);
  color: #e5e7eb;
  font-size: clamp(13px, 3vw, 14px);
  font-weight: 500;
  letter-spacing: 0.025em;
  line-height: 1.3;
}

.text-input {
  width: 100%;
  padding: clamp(12px, 3vw, 14px) clamp(40px, 10vw, 48px) clamp(12px, 3vw, 14px)
    clamp(12px, 3vw, 16px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: clamp(10px, 2.5vw, 12px);
  color: white;
  font-size: clamp(14px, 3.5vw, 16px);
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  box-sizing: border-box;
  min-height: clamp(44px, 11vw, 48px);
}

.text-input:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.6);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
}

.text-input::placeholder {
  color: #6b7280;
  font-size: clamp(13px, 3vw, 14px);
}

.text-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.input-icon {
  position: absolute;
  right: clamp(12px, 3vw, 16px);
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: clamp(13px, 3vw, 14px);
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  right: clamp(12px, 3vw, 16px);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: clamp(13px, 3vw, 14px);
  transition: all 0.3s ease;
  padding: 4px;
  border-radius: 4px;
}

.password-toggle:hover:not(:disabled) {
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.05);
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Login Options */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e5e7eb;
  font-size: clamp(12px, 3vw, 13px);
}

.remember-label input {
  accent-color: #6366f1;
}

.remember-text {
  user-select: none;
}

.forgot-password-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: clamp(12px, 3vw, 13px);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
  text-decoration: underline;
}

.forgot-password-btn:hover:not(:disabled) {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.forgot-password-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Buttons */
.modal-buttons {
  margin-bottom: clamp(20px, 5vw, 24px);
}

.rainbow-button {
  width: 100%;
  padding: clamp(14px, 3.5vw, 16px) 0;
  border-radius: clamp(10px, 2.5vw, 12px);
  background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff);
  background-size: 300% 300%;
  animation: gradientMove 6s ease infinite;
  border: none;
  color: white;
  font-weight: 600;
  font-size: clamp(15px, 3.5vw, 16px);
  letter-spacing: 0.025em;
  box-shadow:
    0 10px 20px -3px rgba(0, 0, 0, 0.3),
    0 4px 8px -2px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: clamp(48px, 12vw, 52px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.rainbow-button:hover:not(:disabled) {
  box-shadow:
    0 20px 30px -5px rgba(0, 0, 0, 0.4),
    0 10px 15px -5px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
  animation-duration: 3s;
}

.rainbow-button:active:not(:disabled) {
  transform: scale(0.98);
}

.rainbow-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  animation: none;
}

.button-loading,
.button-text {
  position: relative;
  z-index: 10;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 1.5vw, 8px);
  line-height: 1.2;
}

/* Auth Switch */
.auth-switch {
  text-align: center;
  margin-top: clamp(16px, 4vw, 20px);
}

.auth-switch p {
  color: #9ca3af;
  font-size: clamp(13px, 3vw, 14px);
  margin: 0;
  line-height: 1.4;
}

.switch-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.switch-link:hover {
  color: #10b981;
  text-decoration: underline;
}

/* Error Message */
.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px);
  border-radius: clamp(8px, 2vw, 10px);
  font-size: clamp(13px, 3vw, 14px);
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.5vw, 8px);
  animation: slideDown 0.3s ease;
  line-height: 1.3;
  margin-bottom: clamp(16px, 4vw, 20px);
}

.error-message i {
  font-size: clamp(12px, 3vw, 14px);
  flex-shrink: 0;
}

/* Update button icon spacing */
.rainbow-button .button-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  100% {
    transform: rotate(-360deg);
  }
}

@keyframes orbit {
  0% {
    transform: translateX(-50%) rotate(0deg) translateY(clamp(-40px, -10vw, -50px)) rotate(0deg);
  }
  100% {
    transform: translateX(-50%) rotate(360deg) translateY(clamp(-40px, -10vw, -50px))
      rotate(-360deg);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 365px) {
  .modal-content {
    padding: 20px 16px;
    border-radius: 20px;
  }
}

@media (min-width: 1200px) {
  .modal-content {
    max-width: 480px;
  }
}

/* Focus states for accessibility */
.close-button:focus-visible,
.text-input:focus-visible,
.password-toggle:focus-visible,
.rainbow-button:focus-visible,
.switch-link:focus-visible,
.forgot-password-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>

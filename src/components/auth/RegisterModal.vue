<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- Success Modal Overlay -->
      <div v-if="showSuccess" class="success-overlay">
        <div class="success-content">
          <!-- Success Animation -->
          <div class="success-animation">
            <div class="success-circle">
              <i class="fa-solid fa-check"></i>
            </div>
            <!-- Confetti -->
            <div class="confetti-container">
              <div v-for="n in 30" :key="n" class="confetti" :style="getConfettiStyle(n)"></div>
            </div>
            <!-- Floating Particles -->
            <div class="floating-particles">
              <div v-for="n in 20" :key="n" class="particle" :style="getParticleStyle(n)"></div>
            </div>
          </div>

          <!-- Success Message -->
          <div class="success-message">
            <h3 class="success-title">Account Created Successfully! 🎉</h3>
            <p class="success-subtitle">
              Welcome to Golden Rise, {{ savedUserName }}! Your trading journey begins now.
            </p>

            <!-- User Details -->
            <div class="user-details-card">
              <div class="detail-item">
                <i class="fa-solid fa-user-circle"></i>
                <div>
                  <span class="detail-label">Name</span>
                  <span class="detail-value">{{ savedUserName }}</span>
                </div>
              </div>
              <div class="detail-item">
                <i class="fa-solid fa-envelope"></i>
                <div>
                  <span class="detail-label">Email</span>
                  <span class="detail-value">{{ savedUserEmail }}</span>
                </div>
              </div>
              <div class="detail-item">
                <i class="fa-solid fa-calendar-check"></i>
                <div>
                  <span class="detail-label">Member Since</span>
                  <span class="detail-value">{{ new Date().toLocaleDateString() }}</span>
                </div>
              </div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
              <h4>Next Steps:</h4>
              <ul>
                <li><i class="fa-solid fa-check-circle"></i> Complete your profile</li>
                <li><i class="fa-solid fa-check-circle"></i> Explore trading features</li>
                <li><i class="fa-solid fa-check-circle"></i> Start your first investment</li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="success-buttons">
              <button @click="goToDashboard" class="dashboard-btn">
                <i class="fa-solid fa-rocket"></i>
                Go to Dashboard
              </button>
              <button @click="closeSuccessModal" class="close-success-btn">
                <i class="fa-solid fa-xmark"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Register Form (shown when not in success state) -->
      <div v-else>
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
        <h3 class="modal-title">Create Account</h3>
        <p class="modal-subtitle">Join Golden Rise and start your journey</p>

        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-fields">
            <div class="input-group">
              <label class="input-label">Full Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="text-input"
                placeholder="Enter your full name"
                :disabled="loading"
              />
              <i class="fa-solid fa-user input-icon"></i>
            </div>

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
                placeholder="Create a password"
                minlength="6"
                :disabled="loading"
                @input="validatePassword"
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

            <div class="input-group">
              <label class="input-label">Confirm Password</label>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="text-input"
                placeholder="Confirm your password"
                :disabled="loading"
                @input="validatePassword"
              />
              <i class="fa-solid fa-lock input-icon"></i>
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="password-toggle"
                :disabled="loading"
              >
                <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Password Strength Indicator -->
          <div class="password-strength" v-if="form.password">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :class="passwordStrength.class"
                :style="{ width: passwordStrength.percentage + '%' }"
              ></div>
            </div>
            <p class="strength-text" :class="passwordStrength.class">
              {{ passwordStrength.text }}
            </p>
          </div>

          <!-- Password Requirements -->
          <div class="password-requirements" v-if="form.password">
            <p class="requirements-title">Password must contain:</p>
            <ul>
              <li :class="{ met: hasMinLength }">
                <i :class="hasMinLength ? 'fa-solid fa-check' : 'fa-solid fa-circle'"></i>
                At least 8 characters
              </li>
              <li :class="{ met: hasUpperCase }">
                <i :class="hasUpperCase ? 'fa-solid fa-check' : 'fa-solid fa-circle'"></i>
                One uppercase letter
              </li>
              <li :class="{ met: hasLowerCase }">
                <i :class="hasLowerCase ? 'fa-solid fa-check' : 'fa-solid fa-circle'"></i>
                One lowercase letter
              </li>
              <li :class="{ met: hasNumber }">
                <i :class="hasNumber ? 'fa-solid fa-check' : 'fa-solid fa-circle'"></i>
                One number
              </li>
              <li :class="{ met: hasSpecialChar }">
                <i :class="hasSpecialChar ? 'fa-solid fa-check' : 'fa-solid fa-circle'"></i>
                One special character
              </li>
            </ul>
          </div>

          <!-- Terms and Conditions -->
          <div class="terms-group">
            <label class="terms-label">
              <input type="checkbox" v-model="acceptedTerms" :disabled="loading" required />
              <span class="terms-text">
                I agree to the <a href="#" class="terms-link">Terms of Service</a> and
                <a href="#" class="terms-link">Privacy Policy</a>
              </span>
            </label>
          </div>

          <div class="modal-buttons">
            <button type="submit" :disabled="loading || !isFormValid" class="rainbow-button">
              <span v-if="loading" class="button-loading">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Creating Account...
              </span>
              <span v-else class="button-text"> Create Account </span>
            </button>

            <div class="auth-switch">
              <p>
                Already have an account?
                <a href="#" @click.prevent="$emit('switch-to-login')" class="switch-link">
                  Login here
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close', 'switch-to-login', 'success'])
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptedTerms = ref(false)
const showSuccess = ref(false)
const savedUserName = ref('')
const savedUserEmail = ref('')

// Computed properties for password validation
const hasMinLength = computed(() => form.value.password.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(form.value.password))
const hasLowerCase = computed(() => /[a-z]/.test(form.value.password))
const hasNumber = computed(() => /[0-9]/.test(form.value.password))
const hasSpecialChar = computed(() =>
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.value.password),
)

const isPasswordValid = computed(() => {
  return (
    hasMinLength.value &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    hasSpecialChar.value &&
    form.value.password === form.value.confirmPassword
  )
})

const isFormValid = computed(() => {
  return form.value.name && form.value.email && isPasswordValid.value && acceptedTerms.value
})

const passwordStrength = computed(() => {
  const requirements = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar]
  const metCount = requirements.filter((req) => req.value).length
  const percentage = (metCount / requirements.length) * 100

  if (percentage <= 20) return { class: 'weak', text: 'Weak', percentage }
  if (percentage <= 60) return { class: 'fair', text: 'Fair', percentage }
  if (percentage <= 80) return { class: 'good', text: 'Good', percentage }
  return { class: 'strong', text: 'Strong', percentage }
})

// Save user to localStorage
const saveUserToStorage = (userData) => {
  try {
    const users = JSON.parse(localStorage.getItem('wadajir_users') || '[]')

    // Check if user already exists
    const existingUser = users.find((user) => user.email === userData.email)
    if (existingUser) {
      throw new Error('An account with this email already exists')
    }

    // Add new user with additional data
    users.push({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: form.value.password, // Store password for demo (in real app, hash this!)
      createdAt: new Date().toISOString(),
      balance: 10000, // Initial balance for new users
      membership: 'Basic',
      verified: false,
      lastLogin: new Date().toISOString(),
    })

    localStorage.setItem('wadajir_users', JSON.stringify(users))
    console.log('User saved to localStorage:', userData.email)

    // Also set current user session
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        token: userData.token,
      }),
    )

    return true
  } catch (error) {
    console.error('Error saving user to localStorage:', error)
    throw error
  }
}

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all fields correctly and accept the terms'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (!isPasswordValid.value) {
    error.value = 'Password does not meet the requirements'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('wadajir_users') || '[]')
    const userExists = existingUsers.find((user) => user.email === form.value.email)

    if (userExists) {
      throw new Error('An account with this email already exists. Please login instead.')
    }

    // Create user data
    const userData = {
      id: Date.now().toString(),
      name: form.value.name,
      email: form.value.email,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }

    // Save user to localStorage
    saveUserToStorage(userData)

    console.log('Registration successful:', userData)

    // Save user details for success message
    savedUserName.value = form.value.name
    savedUserEmail.value = form.value.email

    // Clear form
    form.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
    acceptedTerms.value = false

    // Show success message
    error.value = ''
    showSuccess.value = true

    // Emit success event
    emit('success', userData)
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const validatePassword = () => {
  // Clear error when user starts typing
  if (error.value && error.value.includes('password')) {
    error.value = ''
  }
}

const getConfettiStyle = (index) => {
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8f00ff']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const delay = Math.random() * 2
  const duration = 1 + Math.random() * 2
  const size = 4 + Math.random() * 6

  return {
    background: color,
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    animationDuration: duration + 's',
  }
}

const getParticleStyle = (index) => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const size = 2 + Math.random() * 3
  const delay = Math.random() * 5

  return {
    background: color,
    left: Math.random() * 100 + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
  }
}

const goToDashboard = () => {
  // First hide the success modal
  showSuccess.value = false

  // Small delay to allow the transition
  setTimeout(() => {
    // Emit close event to parent
    emit('close')

    // Navigate to dashboard after ensuring modal is closed
    setTimeout(() => {
      router.push('/dashboard')
    }, 50)
  }, 50)
}

const closeSuccessModal = () => {
  showSuccess.value = false
  emit('close')
}
</script>

<style scoped>
/* Success Overlay Styles */
.success-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5, 5, 16, 0.95);
  backdrop-filter: blur(12px);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: inherit;
  animation: fadeIn 0.3s ease;
}

.success-content {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

/* Success Animation */
.success-animation {
  position: relative;
  margin: 0 auto 30px;
}

.success-circle {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  position: relative;
  z-index: 2;
  animation: successPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
}

.success-circle i {
  font-size: 40px;
  color: white;
  animation: checkMark 0.3s 0.2s ease-out forwards;
  opacity: 0;
  transform: scale(0);
}

@keyframes successPop {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes checkMark {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Confetti */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.confetti {
  position: absolute;
  border-radius: 2px;
  animation: confettiFall linear forwards;
  transform: rotate(45deg);
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(200px) rotate(360deg);
    opacity: 0;
  }
}

/* Floating Particles */
.floating-particles {
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  bottom: -50px;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: floatParticle 10s infinite ease-in-out;
}

@keyframes floatParticle {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

/* Success Message */
.success-message {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(20px);
}

.success-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0 0 10px;
  background: linear-gradient(to right, #10b981, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.success-subtitle {
  color: #9ca3af;
  font-size: 16px;
  margin: 0 0 25px;
  line-height: 1.5;
}

/* User Details Card */
.user-details-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 0 25px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.detail-item i {
  font-size: 20px;
  color: #6366f1;
  width: 30px;
}

.detail-item div {
  flex: 1;
  text-align: left;
}

.detail-label {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 2px;
}

.detail-value {
  display: block;
  font-size: 14px;
  color: white;
  font-weight: 500;
}

/* Next Steps */
.next-steps {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin: 0 0 25px;
  text-align: left;
}

.next-steps h4 {
  font-size: 16px;
  color: white;
  margin: 0 0 15px;
}

.next-steps ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-steps li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #d1d5db;
  font-size: 14px;
  margin-bottom: 8px;
}

.next-steps li:last-child {
  margin-bottom: 0;
}

.next-steps li i {
  color: #10b981;
  font-size: 14px;
}

/* Success Buttons */
.success-buttons {
  display: flex;
  gap: 12px;
}

.dashboard-btn {
  flex: 1;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.dashboard-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
}

.close-success-btn {
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 14px 20px;
  color: #9ca3af;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.close-success-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Overlay - Fixed for proper removal */
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
.register-form {
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

/* Password Strength */
.password-strength {
  margin-bottom: clamp(16px, 4vw, 20px);
}

.strength-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: #ef4444;
}

.strength-fill.fair {
  background: #f59e0b;
}

.strength-fill.good {
  background: #3b82f6;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-text {
  margin: 0;
  font-size: clamp(12px, 3vw, 13px);
  font-weight: 500;
  text-align: center;
}

.strength-text.weak {
  color: #ef4444;
}
.strength-text.fair {
  color: #f59e0b;
}
.strength-text.good {
  color: #3b82f6;
}
.strength-text.strong {
  color: #10b981;
}

/* Password Requirements */
.password-requirements {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: clamp(16px, 4vw, 20px);
  margin-bottom: clamp(20px, 5vw, 24px);
}

.requirements-title {
  color: #e5e7eb;
  font-size: clamp(13px, 3vw, 14px);
  font-weight: 600;
  margin: 0 0 12px 0;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: clamp(12px, 3vw, 13px);
  transition: color 0.3s ease;
}

.password-requirements li.met {
  color: #10b981;
}

.password-requirements li i {
  font-size: clamp(10px, 2.5vw, 12px);
  width: 14px;
}

.password-requirements li.met i {
  color: #10b981;
}

/* Terms and Conditions */
.terms-group {
  margin-bottom: clamp(20px, 5vw, 24px);
}

.terms-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  color: #e5e7eb;
  font-size: clamp(13px, 3vw, 14px);
  line-height: 1.4;
}

.terms-label input {
  accent-color: #6366f1;
  margin-top: 2px;
  flex-shrink: 0;
}

.terms-text {
  flex: 1;
}

.terms-link {
  color: #6366f1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #10b981;
  text-decoration: underline;
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
}

.error-message i {
  font-size: clamp(12px, 3vw, 14px);
  flex-shrink: 0;
}

/* Animations */
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

  .password-requirements ul {
    gap: 6px;
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
.terms-link:focus-visible {
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

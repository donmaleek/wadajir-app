<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- Close Button -->
      <button class="close-button" @click="$emit('close')">
        <i class="fa-solid fa-times"></i>
      </button>

      <!-- Logo Container -->
      <div class="modal-logo-container">
        <div class="tech-ring ring-1"></div>
        <div class="tech-ring ring-2"></div>

        <div class="rainbow-border-circle">
          <div class="logo-inner">
            <i class="fa-solid fa-key logo-icon"></i>
          </div>
        </div>

        <div class="orbital-dot"></div>
      </div>

      <!-- Title -->
      <h3 class="modal-title">Reset Your Password</h3>
      <p class="modal-subtitle">Enter your email to receive password reset instructions</p>

      <!-- Progress Steps -->
      <div class="progress-steps" v-if="currentStep < 3">
        <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <span class="step-label">Enter Email</span>
        </div>
        <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <span class="step-label">Verify Code</span>
        </div>
        <div class="step" :class="{ active: currentStep >= 3 }">
          <div class="step-number">3</div>
          <span class="step-label">New Password</span>
        </div>
      </div>

      <!-- Step 1: Email Input -->
      <form @submit.prevent="handleSendCode" class="forgot-form" v-if="currentStep === 1">
        <div class="form-fields">
          <div class="input-group">
            <label>Email Address</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="Enter your registered email"
              :disabled="loading"
              class="form-input"
            />
            <i class="fa-solid fa-envelope input-icon"></i>
          </div>
        </div>

        <div class="modal-buttons">
          <button type="submit" :disabled="loading || !form.email" class="submit-btn">
            <span v-if="loading" class="button-loading">
              <i class="fa-solid fa-spinner fa-spin"></i>
              Sending Code...
            </span>
            <span v-else class="button-text"> Send Reset Code </span>
          </button>
        </div>

        <div class="auth-switch">
          <p>
            Remember your password?
            <a href="#" @click.prevent="$emit('switch-to-login')" class="switch-link">
              Back to Login
            </a>
          </p>
        </div>

        <div v-if="error" class="error-message">
          <i class="fa-solid fa-circle-exclamation"></i>
          {{ error }}
        </div>
      </form>

      <!-- Step 2: Verification Code -->
      <form @submit.prevent="handleVerifyCode" class="forgot-form" v-else-if="currentStep === 2">
        <div class="verification-info">
          <i class="fa-solid fa-envelope-circle-check"></i>
          <p>
            We sent a 6-digit verification code to <strong>{{ form.email }}</strong>
          </p>
        </div>

        <div class="form-fields">
          <div class="input-group">
            <label>Verification Code</label>
            <div class="code-inputs">
              <input
                v-for="n in 6"
                :key="n"
                :ref="(el) => (codeInputs[n - 1] = el)"
                v-model="verificationCode[n - 1]"
                type="text"
                maxlength="1"
                @input="handleCodeInput(n - 1, $event)"
                @keydown="handleCodeKeydown(n - 1, $event)"
                @paste="handleCodePaste"
                :disabled="loading"
                class="code-input"
              />
            </div>
            <i class="fa-solid fa-shield-check input-icon"></i>
          </div>
        </div>

        <div class="resend-code">
          <p>
            Didn't receive the code?
            <button
              type="button"
              @click="handleResendCode"
              :disabled="resendCooldown > 0"
              class="resend-link"
            >
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
            </button>
          </p>
        </div>

        <div class="modal-buttons">
          <button type="submit" :disabled="loading || !isCodeComplete" class="submit-btn">
            <span v-if="loading" class="button-loading">
              <i class="fa-solid fa-spinner fa-spin"></i>
              Verifying...
            </span>
            <span v-else class="button-text"> Verify Code </span>
          </button>
        </div>

        <div v-if="error" class="error-message">
          <i class="fa-solid fa-circle-exclamation"></i>
          {{ error }}
        </div>
      </form>

      <!-- Step 3: New Password -->
      <form @submit.prevent="handleResetPassword" class="forgot-form" v-else-if="currentStep === 3">
        <div class="success-info">
          <i class="fa-solid fa-shield-check"></i>
          <p>Code verified! Now create your new password</p>
        </div>

        <div class="form-fields">
          <div class="input-group">
            <label>New Password</label>
            <input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              required
              placeholder="Enter new password"
              :disabled="loading"
              class="form-input"
              @input="validatePassword"
            />
            <i class="fa-solid fa-lock input-icon"></i>
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="password-toggle"
            >
              <i :class="showNewPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>

          <div class="input-group">
            <label>Confirm New Password</label>
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              placeholder="Confirm new password"
              :disabled="loading"
              class="form-input"
              @input="validatePassword"
            />
            <i class="fa-solid fa-lock input-icon"></i>
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="password-toggle"
            >
              <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Password Strength Indicator -->
        <div class="password-strength" v-if="form.newPassword">
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
        <div class="password-requirements">
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

        <div class="modal-buttons">
          <button type="submit" :disabled="loading || !isPasswordValid" class="submit-btn">
            <span v-if="loading" class="button-loading">
              <i class="fa-solid fa-spinner fa-spin"></i>
              Resetting Password...
            </span>
            <span v-else class="button-text"> Reset Password </span>
          </button>
        </div>

        <div v-if="error" class="error-message">
          <i class="fa-solid fa-circle-exclamation"></i>
          {{ error }}
        </div>
      </form>

      <!-- Success Step -->
      <div class="success-step" v-else>
        <div class="success-icon">
          <i class="fa-solid fa-check"></i>
        </div>
        <h3 class="success-title">Password Reset Successful!</h3>
        <p class="success-message">
          Your password has been successfully reset. You can now log in with your new password.
        </p>

        <div class="modal-buttons">
          <button @click="handleBackToLogin" class="success-btn">
            <i class="fa-solid fa-arrow-right-to-bracket"></i>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'

const emit = defineEmits(['close', 'switch-to-login'])

// Form data
const form = ref({
  email: '',
  newPassword: '',
  confirmPassword: '',
})

// UI state
const currentStep = ref(1)
const loading = ref(false)
const error = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const resendCooldown = ref(0)

// Verification code
const verificationCode = ref(['', '', '', '', '', ''])
const codeInputs = ref([])

// Computed properties
const isCodeComplete = computed(() => {
  return verificationCode.value.every((code) => code !== '')
})

const hasMinLength = computed(() => form.value.newPassword.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(form.value.newPassword))
const hasLowerCase = computed(() => /[a-z]/.test(form.value.newPassword))
const hasNumber = computed(() => /[0-9]/.test(form.value.newPassword))
const hasSpecialChar = computed(() =>
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.value.newPassword),
)

const isPasswordValid = computed(() => {
  return (
    hasMinLength.value &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    hasSpecialChar.value &&
    form.value.newPassword === form.value.confirmPassword
  )
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

// Methods
const handleSendCode = async () => {
  if (!form.value.email) {
    error.value = 'Please enter your email address'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock response
    console.log('Sending verification code to:', form.value.email)
    currentStep.value = 2
    startResendCooldown()
  } catch (err) {
    error.value = 'Failed to send verification code. Please try again.'
    console.error('Send code error:', err)
  } finally {
    loading.value = false
  }
}

const handleVerifyCode = async () => {
  if (!isCodeComplete.value) {
    error.value = 'Please enter the complete verification code'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock verification - in real app, verify with backend
    const enteredCode = verificationCode.value.join('')
    if (enteredCode === '123456') {
      // Mock valid code
      currentStep.value = 3
    } else {
      throw new Error('Invalid verification code')
    }
  } catch (err) {
    error.value = err.message || 'Invalid verification code. Please try again.'
    clearCodeInputs()
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!isPasswordValid.value) {
    error.value = 'Please ensure all password requirements are met and passwords match'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock success
    console.log('Password reset successful for:', form.value.email)
    currentStep.value = 4
  } catch (err) {
    error.value = 'Failed to reset password. Please try again.'
    console.error('Reset password error:', err)
  } finally {
    loading.value = false
  }
}

const handleResendCode = async () => {
  if (resendCooldown.value > 0) return

  loading.value = true
  error.value = ''

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Resending code to:', form.value.email)
    startResendCooldown()
    error.value = '' // Clear any previous errors
  } catch (err) {
    error.value = 'Failed to resend code. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleBackToLogin = () => {
  emit('switch-to-login')
}

const handleCodeInput = (index, event) => {
  const value = event.target.value

  if (value && index < 5) {
    nextTick(() => {
      codeInputs.value[index + 1]?.focus()
    })
  }

  // Auto-submit when all fields are filled
  if (index === 5 && value && isCodeComplete.value) {
    nextTick(() => {
      handleVerifyCode()
    })
  }
}

const handleCodeKeydown = (index, event) => {
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    nextTick(() => {
      codeInputs.value[index - 1]?.focus()
    })
  }
}

const handleCodePaste = (event) => {
  event.preventDefault()
  const pasteData = event.clipboardData.getData('text').slice(0, 6)
  const pasteArray = pasteData.split('')

  pasteArray.forEach((char, index) => {
    if (index < 6) {
      verificationCode.value[index] = char
    }
  })

  nextTick(() => {
    if (pasteArray.length === 6) {
      codeInputs.value[5]?.focus()
    } else if (pasteArray.length > 0) {
      codeInputs.value[pasteArray.length]?.focus()
    }
  })
}

const clearCodeInputs = () => {
  verificationCode.value = ['', '', '', '', '', '']
  nextTick(() => {
    codeInputs.value[0]?.focus()
  })
}

const startResendCooldown = () => {
  resendCooldown.value = 30
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

const validatePassword = () => {
  // Clear error when user starts typing
  if (error.value && error.value.includes('password')) {
    error.value = ''
  }
}

// Initialize first code input focus
onMounted(() => {
  nextTick(() => {
    if (currentStep.value === 2 && codeInputs.value[0]) {
      codeInputs.value[0].focus()
    }
  })
})
</script>

<style scoped>
/* Base modal styles (same as login) */
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
  /* Fixed mask compatibility */
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

.logo-icon {
  font-size: clamp(24px, 6vw, 32px);
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
  /* Fixed background-clip compatibility */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shine 5s linear infinite;
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

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(24px, 6vw, 32px);
  position: relative;
  padding: 0 clamp(10px, 2.5vw, 20px);
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 20px;
  right: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-50%);
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.step-number {
  width: clamp(28px, 7vw, 32px);
  height: clamp(28px, 7vw, 32px);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
  color: #6366f1;
}

.step.completed .step-number {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.step-label {
  font-size: clamp(10px, 2.5vw, 12px);
  color: #9ca3af;
  font-weight: 500;
  text-align: center;
  transition: color 0.3s ease;
}

.step.active .step-label {
  color: #e5e7eb;
}

/* Form Styles */
.forgot-form {
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

.input-group label {
  display: block;
  margin-bottom: clamp(6px, 1.5vw, 8px);
  color: #e5e7eb;
  font-size: clamp(13px, 3vw, 14px);
  font-weight: 500;
  letter-spacing: 0.025em;
  line-height: 1.3;
}

.form-input {
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

.form-input:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.6);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
}

.form-input::placeholder {
  color: #6b7280;
  font-size: clamp(13px, 3vw, 14px);
}

.form-input:disabled {
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

/* Code Inputs */
.code-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.code-input {
  width: clamp(40px, 10vw, 48px) !important;
  height: clamp(48px, 12vw, 56px) !important;
  text-align: center;
  font-size: clamp(18px, 4.5vw, 20px) !important;
  font-weight: 600;
  padding: 0 !important;
}

.code-input:focus {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}

/* Info Sections */
.verification-info,
.success-info {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: clamp(12px, 3vw, 16px);
  margin-bottom: clamp(20px, 5vw, 24px);
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.verification-info i,
.success-info i {
  color: #3b82f6;
  font-size: clamp(16px, 4vw, 18px);
  flex-shrink: 0;
}

.verification-info p,
.success-info p {
  margin: 0;
  color: #e5e7eb;
  font-size: clamp(13px, 3vw, 14px);
  line-height: 1.4;
}

.verification-info strong {
  color: white;
  font-weight: 600;
}

/* Resend Code */
.resend-code {
  text-align: center;
  margin-bottom: clamp(20px, 5vw, 24px);
}

.resend-code p {
  color: #9ca3af;
  font-size: clamp(13px, 3vw, 14px);
  margin: 0;
}

.resend-link {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: underline;
}

.resend-link:hover:not(:disabled) {
  color: #10b981;
}

.resend-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #6b7280;
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

/* Buttons */
.modal-buttons {
  margin-bottom: clamp(20px, 5vw, 24px);
}

.submit-btn {
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

.submit-btn:hover:not(:disabled) {
  box-shadow:
    0 20px 30px -5px rgba(0, 0, 0, 0.4),
    0 10px 15px -5px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
  animation-duration: 3s;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
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

/* Success Step */
.success-step {
  text-align: center;
  padding: clamp(20px, 5vw, 40px) 0;
}

.success-icon {
  width: clamp(80px, 20vw, 100px);
  height: clamp(80px, 20vw, 100px);
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto clamp(20px, 5vw, 24px);
  animation: scaleIn 0.5s ease;
}

.success-icon i {
  font-size: clamp(32px, 8vw, 40px);
  color: white;
}

.success-title {
  font-size: clamp(24px, 6vw, 28px);
  font-weight: 600;
  color: white;
  margin: 0 0 clamp(12px, 3vw, 16px) 0;
}

.success-message {
  color: #9ca3af;
  font-size: clamp(14px, 3.5vw, 16px);
  line-height: 1.5;
  margin: 0 0 clamp(24px, 6vw, 32px) 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.success-btn {
  width: 100%;
  max-width: 200px;
  padding: clamp(14px, 3.5vw, 16px) clamp(20px, 5vw, 24px);
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: clamp(15px, 3.5vw, 16px);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
}

.success-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
}

/* Auth Switch */
.auth-switch {
  text-align: center;
  margin-bottom: clamp(12px, 3vw, 16px);
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

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 365px) {
  .modal-content {
    padding: 20px 16px;
    border-radius: 20px;
  }

  .code-inputs {
    gap: 6px;
  }

  .code-input {
    width: 36px !important;
    height: 44px !important;
  }

  .progress-steps {
    padding: 0 5px;
  }

  .step-label {
    font-size: 9px;
  }
}

@media (min-width: 1200px) {
  .modal-content {
    max-width: 480px;
  }
}

/* Focus states */
.close-button:focus-visible,
.form-input:focus-visible,
.password-toggle:focus-visible,
.submit-btn:focus-visible,
.switch-link:focus-visible,
.resend-link:focus-visible,
.code-input:focus-visible,
.success-btn:focus-visible {
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

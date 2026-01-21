<template>
  <div class="landing-page">
    <!-- Minimal Background -->
    <div class="bg-gradient"></div>

    <!-- Language Selector -->
    <div class="language-selector" @click="toggleLanguage">
      <i class="fa-solid fa-globe globe-icon"></i>
      <span class="language-text">{{ currentLanguage }}</span>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Logo -->
      <div class="logo-container">
        <div class="logo-wrapper">
          <div class="logo-circle">
            <span class="logo-text">GR</span>
          </div>
        </div>
      </div>

      <!-- App Name -->
      <div class="brand-section">
        <h1 class="app-name">Golden Rise</h1>
        <p class="brand-tagline">AI-Powered Trading Intelligence</p>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="handleRegister" class="btn btn-primary">Create Account</button>
        <button @click="handleLogin" class="btn btn-secondary">Sign In</button>
      </div>

      <!-- Additional Info -->
      <div class="additional-info">
        <p class="info-text">24/7 automated trading based on real-time market analysis</p>
        <div class="trust-indicators">
          <div class="trust-item">
            <i class="fa-solid fa-shield-alt"></i>
            <span>Auto Trading</span>
          </div>
          <div class="trust-item">
            <i class="fa-solid fa-users"></i>
            <span>Predictive Analytics</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="page-footer">
      <p class="footer-text">
        © {{ currentYear }} Golden Rise. All rights reserved.
        <a href="#" class="footer-link">Privacy Policy</a>
        <a href="#" class="footer-link">Terms of Service</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['showLogin', 'showRegister'])

const currentLanguage = ref('EN')
const currentYear = ref(new Date().getFullYear()) // reactive year

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'EN' ? 'SO' : 'EN'
}

const handleRegister = () => {
  emit('showRegister')
}

const handleLogin = () => {
  emit('showLogin')
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #050510;
  font-family: 'Montserrat', sans-serif;
  position: relative;
}

/* Background */
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
  z-index: 1;
}

/* Language Selector */
.language-selector {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 100;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.language-selector:hover {
  background: rgba(255, 255, 255, 0.1);
}

.globe-icon {
  font-size: 14px;
  color: #8b5cf6;
}

.language-text {
  font-size: 14px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  position: relative;
  z-index: 2;
}

/* Logo */
.logo-container {
  margin-bottom: 32px;
}

.logo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.logo-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #050510;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.logo-circle::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: gradientRotate 4s linear infinite;
}

.logo-text {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: gradientShift 8s ease infinite;
}

/* Brand Section */
.brand-section {
  text-align: center;
  margin-bottom: 48px;
}

.app-name {
  font-size: 42px;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-bottom: 12px;
  text-transform: uppercase;
  background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: gradientShift 8s ease infinite;
}

.brand-tagline {
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.1em;
}

/* Buttons */
.action-buttons {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
}

.btn {
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff);
  background-size: 200% auto;
  color: white;
  animation: gradientShift 8s ease infinite;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Additional Info */
.additional-info {
  text-align: center;
  max-width: 400px;
}

.info-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 24px;
  font-weight: 300;
}

.trust-indicators {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.trust-item i {
  color: #8b5cf6;
  font-size: 14px;
}

/* Footer */
.page-footer {
  padding: 20px 24px;
  background: rgba(5, 5, 16, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.footer-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.footer-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.8);
}

/* Animations */
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes gradientRotate {
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-name {
    font-size: 32px;
    letter-spacing: 0.1em;
  }

  .brand-tagline {
    font-size: 14px;
  }

  .logo-wrapper {
    width: 100px;
    height: 100px;
  }

  .logo-text {
    font-size: 40px;
  }

  .trust-indicators {
    flex-direction: column;
    gap: 16px;
  }

  .footer-text {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 24px 16px;
  }

  .app-name {
    font-size: 28px;
  }

  .action-buttons {
    max-width: 280px;
  }

  .btn {
    padding: 14px 20px;
    font-size: 15px;
  }
}

/* Accessibility */
.btn:focus-visible,
.language-selector:focus-visible {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}
</style>

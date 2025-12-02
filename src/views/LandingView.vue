<template>
  <div class="landing-page">
    <!-- Background Decoration -->
    <div class="bg-mesh"></div>

    <!-- Top Right: Language Selector -->
    <div class="language-selector" @click="toggleLanguage">
      <span class="language-text">{{ currentLanguage }}</span>
      <i class="fa-solid fa-globe globe-icon"></i>
    </div>

    <!-- Main Content: Centered -->
    <div class="main-content">
      <!-- Logo Container -->
      <div class="logo-container">
        <!-- Rotating Tech Rings (Decorative) -->
        <div class="tech-ring ring-1"></div>
        <div class="tech-ring ring-2"></div>

        <!-- Main Rainbow Border Circle -->
        <div class="rainbow-border-circle">
          <!-- Inner Content -->
          <div class="logo-inner">
            <span class="logo-text">W</span>
          </div>
        </div>

        <!-- Small orbital dot -->
        <div class="orbital-dot"></div>
      </div>

      <!-- App Name -->
      <h1 class="app-name">
        <span class="app-name-text">WADAJIR</span>
      </h1>

      <!-- Buttons Area -->
      <div class="buttons-container">
        <button @click="handleRegister" class="rainbow-button">
          <span class="button-text">Register</span>
        </button>

        <button @click="handleLogin" class="login-button">
          <span class="login-text">Login</span>
        </button>
      </div>
    </div>

    <!-- Bottom Right: Service Tab (AI Chat) -->
    <div class="service-tab" @click="handleService">
      <span class="service-text">Service</span>
      <div class="pulse-dot"></div>
      <i class="fa-solid fa-message message-icon"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Define emits with proper validation
const emit = defineEmits({
  'show-register': null,
  'show-login': null,
  'show-service': null,
})

const currentLanguage = ref('English')

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'English' ? 'Somali' : 'English'
  // You can add actual language switching logic here
  console.log('Language switched to:', currentLanguage.value)
}

// Event handlers with validation
const handleRegister = () => {
  console.log('Register button clicked')
  emit('show-register')
}

const handleLogin = () => {
  console.log('Login button clicked')
  emit('show-login')
}

const handleService = () => {
  console.log('Service tab clicked')
  emit('show-service')
}

// Add lifecycle hook for any initialization
onMounted(() => {
  console.log('Landing page mounted')
})
</script>

<style scoped>
.landing-page {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #050510;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
}

/* Background mesh */
.bg-mesh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 80% 20%, rgba(100, 0, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 40%);
  z-index: 0;
}

/* Language Selector */
.language-selector {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.3s ease;
  z-index: 20;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.language-selector:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.language-text {
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.025em;
  color: white;
}

.globe-icon {
  width: 20px;
  height: 20px;
  color: #10b981; /* emerald-400 */
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  margin-bottom: 48px;
  position: relative;
  z-index: 10;
}

/* Logo Container */
.logo-container {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.tech-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  animation: spin-reverse 20s linear infinite;
}

.ring-1 {
  inset: -10px;
  opacity: 0.3;
}

.ring-2 {
  inset: -20px;
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
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 1;
}

.rainbow-border-circle::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  padding: 4px;
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
  width: 128px;
  height: 128px;
  background: #050510;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #374151;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}

.logo-text {
  font-size: 60px;
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
  /* Fixed background-clip compatibility */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shine 5s linear infinite;
  padding-top: 8px;
}

.orbital-dot {
  position: absolute;
  top: 0;
  left: 50%;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px white;
  transform: translateX(-50%);
  animation: orbit 3s linear infinite;
}

/* App Name */
.app-name {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 0.2em;
  margin-bottom: 48px;
  text-transform: uppercase;
  text-align: center;
}

@media (min-width: 768px) {
  .app-name {
    font-size: 48px;
  }
}

.app-name-text {
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
  font-weight: 600;
}

/* Buttons */
.buttons-container {
  width: 100%;
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px;
}

.rainbow-button {
  width: 100%;
  padding: 16px 0;
  border-radius: 12px;
  background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff);
  background-size: 300% 300%;
  animation: gradientMove 6s ease infinite;
  border: none;
  color: white;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.025em;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.3s;
  cursor: pointer;
}

.rainbow-button:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
  animation-duration: 3s; /* Speed up animation on hover */
}

.rainbow-button:active {
  transform: scale(0.98);
}

.rainbow-button::before {
  content: '';
  position: absolute;
  inset: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.3s;
}

.rainbow-button:hover::before {
  opacity: 1;
}

.button-text {
  position: relative;
  z-index: 10;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.login-button {
  width: 100%;
  padding: 16px 0;
  border-radius: 12px;
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(55, 65, 81, 1);
  color: white;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.025em;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.login-button:hover {
  background: rgba(55, 65, 81, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: rgba(99, 102, 241, 0.5);
}

.login-text {
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

/* Service Tab */
.service-tab {
  position: absolute;
  bottom: 32px;
  right: 0;
  background: #1a1a2e;
  padding: 12px 8px;
  border-left: 1px solid #374151;
  border-top: 1px solid #374151;
  border-bottom: 1px solid #374151;
  border-radius: 8px 0 0 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 20;
  backdrop-filter: blur(10px);
}

.service-tab:hover {
  background: #252540;
  transform: translateX(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.service-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #9ca3af;
  text-transform: uppercase;
  transition: color 0.3s;
}

.service-tab:hover .service-text {
  color: #ffffff;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 2s infinite;
}

.service-tab:hover .pulse-dot {
  background: #10b981;
  animation-duration: 1s;
}

.message-icon {
  width: 20px;
  height: 20px;
  color: #60a5fa;
  transition: color 0.3s;
}

.service-tab:hover .message-icon {
  color: #3b82f6;
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

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes orbit {
  0% {
    transform: translateX(-50%) rotate(0deg) translateY(-80px) rotate(0deg);
  }
  100% {
    transform: translateX(-50%) rotate(360deg) translateY(-80px) rotate(-360deg);
  }
}

/* Responsive improvements */
@media (max-width: 480px) {
  .logo-container {
    width: 120px;
    height: 120px;
  }

  .logo-inner {
    width: 96px;
    height: 96px;
  }

  .logo-text {
    font-size: 48px;
  }

  .app-name {
    font-size: 28px;
    letter-spacing: 0.15em;
  }

  .buttons-container {
    max-width: 16rem;
  }

  .rainbow-button,
  .login-button {
    padding: 14px 0;
    font-size: 16px;
  }
}

/* Loading state for buttons */
.rainbow-button:disabled,
.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Focus states for accessibility */
.rainbow-button:focus-visible,
.login-button:focus-visible,
.language-selector:focus-visible,
.service-tab:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>

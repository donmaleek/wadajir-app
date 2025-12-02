<template>
  <div class="logo-circle" :class="size" @click="$emit('click')">
    <div class="spin-ring"></div>
    <div class="spin-ring-2"></div>
    <h1
      class="text-6xl font-bold logo-font text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
    >
      W
    </h1>
    <div
      v-if="showPulse"
      class="absolute right-0 bottom-0 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'lg', 'xl'].includes(value), // Added 'xl' here
  },
  showPulse: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.logo-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.logo-xl {
  width: 160px;
  height: 160px;
}

.logo-lg {
  width: 120px;
  height: 120px;
}

.logo-sm {
  width: 40px;
  height: 40px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.spin-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #00ff00;
  border-right-color: #00ffff;
  animation: spin 4s linear infinite;
}

.spin-ring-2 {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  border-bottom-color: #ff00ff;
  border-left-color: #ffff00;
  animation: spin-reverse 6s linear infinite;
}

/* XL size styles */
.logo-xl .spin-ring {
  inset: -15px;
}
.logo-xl .spin-ring-2 {
  inset: -8px;
}

.logo-lg .spin-ring {
  inset: -10px;
}
.logo-lg .spin-ring-2 {
  inset: -5px;
}

.logo-sm .spin-ring {
  inset: -3px;
  border-width: 1px;
}
.logo-sm .spin-ring-2 {
  inset: -1.5px;
  border-width: 1px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>

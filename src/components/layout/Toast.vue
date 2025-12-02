<template>
  <transition name="toast">
    <div v-if="show" class="toast-container" :class="toastClass" @click="hideToast">
      <div class="toast-content">
        <div class="toast-icon">
          <i :class="iconClass"></i>
        </div>
        <div class="toast-message">
          {{ message }}
        </div>
        <button @click="hideToast" class="toast-close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
  },
})

const emit = defineEmits(['update:show'])

const toastClass = computed(() => {
  return {
    'toast-success': props.type === 'success',
    'toast-error': props.type === 'error',
    'toast-warning': props.type === 'warning',
    'toast-info': props.type === 'info',
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'fa-solid fa-circle-check'
    case 'error':
      return 'fa-solid fa-circle-exclamation'
    case 'warning':
      return 'fa-solid fa-triangle-exclamation'
    case 'info':
      return 'fa-solid fa-circle-info'
    default:
      return 'fa-solid fa-circle-check'
  }
})

const hideToast = () => {
  emit('update:show', false)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
  background: rgba(17, 17, 31, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toast-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.toast-content {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.toast-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.toast-success .toast-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.toast-error .toast-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.toast-warning .toast-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.toast-info .toast-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.toast-message {
  flex: 1;
  color: white;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Toast Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive Design */
@media (max-width: 640px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>

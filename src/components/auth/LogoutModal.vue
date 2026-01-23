<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="modal-title">
          <i class="fas fa-sign-out-alt"></i>
          <h3>Confirm Logout</h3>
        </div>
        <button class="modal-close" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="logout-icon">
          <i class="fas fa-door-open"></i>
        </div>

        <div class="logout-message">
          <h4>Ready to leave Golden Rise?</h4>
          <p>You'll need to sign in again to access your account and continue mining.</p>
        </div>

        <div class="logout-details">
          <div class="detail-item">
            <i class="fas fa-user"></i>
            <span>User:</span>
            <strong>{{ userEmail }}</strong>
          </div>
          <div class="detail-item">
            <i class="fas fa-wallet"></i>
            <span>Balance:</span>
            <strong>{{ userBalance }}</strong>
          </div>
          <div class="detail-item">
            <i class="fas fa-robot"></i>
            <span>Active Bots:</span>
            <strong>{{ activeBots }}</strong>
          </div>
        </div>

        <div class="logout-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Any unsaved changes will be lost. Make sure your mining bots are in a safe state.</p>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" @click="handleClose">
            <i class="fas fa-arrow-left"></i>
            Cancel
          </button>
          <button class="btn-primary logout-btn" @click="handleConfirm">
            <i class="fas fa-sign-out-alt"></i>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoutModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    userEmail: {
      type: String,
      default: 'user@example.com',
    },
    userBalance: {
      type: String,
      default: '$0.00',
    },
    activeBots: {
      type: Number,
      default: 0,
    },
  },
  emits: ['close', 'confirm'],
  methods: {
    handleClose() {
      this.$emit('close')
    },

    handleConfirm() {
      this.$emit('confirm')
    },

    handleOverlayClick(event) {
      if (event.target.classList.contains('modal-overlay')) {
        this.handleClose()
      }
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
  border: 1px solid #333;
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #333;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-title i {
  color: #ff6b6b;
  font-size: 20px;
}

.modal-title h3 {
  margin: 0;
  color: white;
  font-size: 18px;
}

.modal-close {
  background: transparent;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-body {
  padding: 25px;
}

.logout-icon {
  text-align: center;
  margin-bottom: 20px;
}

.logout-icon i {
  font-size: 4em;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 107, 107, 0.3);
}

.logout-message {
  text-align: center;
  margin-bottom: 25px;
}

.logout-message h4 {
  color: white;
  font-size: 20px;
  margin: 0 0 10px 0;
}

.logout-message p {
  color: #888;
  margin: 0;
  line-height: 1.5;
}

.logout-details {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item i {
  color: #667eea;
  width: 20px;
}

.detail-item span {
  color: #888;
  min-width: 80px;
}

.detail-item strong {
  color: white;
  flex: 1;
  text-align: right;
}

.logout-warning {
  background: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
  padding: 15px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 25px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.logout-warning i {
  color: #ffc107;
  font-size: 18px;
  margin-top: 2px;
}

.logout-warning p {
  color: #ffc107;
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.btn-secondary {
  flex: 1;
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.logout-btn {
  flex: 1;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #ee5a52, #ff4444);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
}

@media (max-width: 480px) {
  .modal-content {
    margin: 10px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .detail-item strong {
    text-align: left;
    width: 100%;
  }
}
</style>

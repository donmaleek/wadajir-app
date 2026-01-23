<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-left">
          <div class="ai-avatar">
            <div class="ai-pulse"></div>
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="header-text">
            <h2>Golden Rise AI Assistant</h2>
            <p class="status" :class="statusClass">{{ statusText }}</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>

      <!-- Chat Messages -->
      <div class="chat-container" ref="chatContainer">
        <div class="welcome-message" v-if="messages.length === 0">
          <div class="welcome-avatar">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="welcome-content">
            <h3>Hello! I'm WADAJIR AI</h3>
            <p>How can I help you today? I can assist with:</p>
            <div class="quick-actions">
              <button
                v-for="action in quickActions"
                :key="action.text"
                @click="sendQuickAction(action)"
                class="quick-action-btn"
              >
                <i :class="action.icon"></i>
                {{ action.text }}
              </button>
            </div>
          </div>
        </div>

        <div class="messages" v-else>
          <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
            <div class="message-avatar" v-if="message.type === 'ai'">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="message-content">
              <div class="message-bubble">
                <p>{{ message.text }}</p>
                <span class="message-time">{{ message.time }}</span>
              </div>
            </div>
            <div class="message-avatar user-avatar" v-if="message.type === 'user'">
              <i class="fa-solid fa-user"></i>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div class="typing-indicator" v-if="isTyping">
            <div class="typing-avatar">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="typing-content">
              <div class="typing-bubble">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-container">
        <div class="input-wrapper">
          <input
            v-model="userInput"
            @keypress.enter="sendMessage"
            type="text"
            placeholder="Type your message here..."
            :disabled="isTyping"
            class="message-input"
          />
          <button @click="sendMessage" :disabled="!userInput.trim() || isTyping" class="send-btn">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <div class="input-footer">
          <p>Golden Rise AI may produce inaccurate information about people, places, or facts.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

// Emits
const emit = defineEmits(['close'])

// Refs
const userInput = ref('')
const messages = ref([])
const isTyping = ref(false)
const chatContainer = ref(null)

// Quick actions
const quickActions = ref([
  { icon: 'fa-solid fa-circle-question', text: 'Help Center' },
  { icon: 'fa-solid fa-gear', text: 'Account Settings' },
  { icon: 'fa-solid fa-credit-card', text: 'Billing Info' },
  { icon: 'fa-solid fa-shield', text: 'Privacy Policy' },
])

// Status
const status = ref('online') // online, away, busy

// Computed
const statusText = computed(() => {
  switch (status.value) {
    case 'online':
      return 'Online'
    case 'away':
      return 'Away'
    case 'busy':
      return 'Busy'
    default:
      return 'Online'
  }
})

const statusClass = computed(() => `status-${status.value}`)

// Methods
const sendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return

  const userMessage = {
    type: 'user',
    text: userInput.value,
    time: getCurrentTime(),
  }

  messages.value.push(userMessage)
  const userText = userInput.value
  userInput.value = ''

  await nextTick()
  scrollToBottom()

  // Simulate AI response
  await simulateAIResponse(userText)
}

const sendQuickAction = (action) => {
  const userMessage = {
    type: 'user',
    text: action.text,
    time: getCurrentTime(),
  }

  messages.value.push(userMessage)
  simulateAIResponse(action.text)
}

const simulateAIResponse = async (userText) => {
  isTyping.value = true
  await nextTick()
  scrollToBottom()

  // Simulate typing delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

  const responses = {
    'Help Center':
      'I can help you navigate our help center! What specific issue are you facing? You can browse our knowledge base or contact support directly.',
    'Account Settings':
      'To manage your account settings, go to your profile page. There you can update your personal information, change passwords, and manage preferences.',
    'Billing Info':
      'For billing inquiries, you can view your invoices, update payment methods, and check subscription details in the billing section of your account.',
    'Privacy Policy':
      'Our privacy policy outlines how we protect your data. You can read the full policy on our website. Is there a specific privacy concern you have?',
    default:
      "Thank you for your message. I understand you're asking about '" +
      userText +
      "'. How can I assist you further with this? Feel free to ask more specific questions!",
  }

  const responseText = responses[userText] || responses['default']

  const aiMessage = {
    type: 'ai',
    text: responseText,
    time: getCurrentTime(),
  }

  messages.value.push(aiMessage)
  isTyping.value = false

  await nextTick()
  scrollToBottom()
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Keyboard event listener
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  // Simulate initial connection
  setTimeout(() => {
    status.value = 'online'
  }, 500)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 5, 16, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #0f0f23;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  height: 80vh;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(26, 26, 46, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.ai-pulse {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.header-text h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.025em;
}

.status {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
}

.status-online {
  color: #10b981;
}

.status-away {
  color: #f59e0b;
}

.status-busy {
  color: #ef4444;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  transform: rotate(90deg);
}

/* Chat Container */
.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.03) 0%, transparent 50%);
}

/* Welcome Message */
.welcome-message {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.welcome-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.welcome-content h3 {
  margin: 0 0 8px 0;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.welcome-content p {
  margin: 0 0 16px 0;
  color: #9ca3af;
  font-size: 14px;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.quick-action-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  color: #e5e7eb;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateY(-1px);
}

.quick-action-btn i {
  color: #60a5fa;
}

/* Messages */
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message.ai {
  flex-direction: row;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  color: #9ca3af;
}

.user-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message.ai .message-bubble {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 4px;
  color: #e5e7eb;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.message-time {
  font-size: 10px;
  opacity: 0.6;
  margin-top: 4px;
  display: block;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.typing-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  color: #9ca3af;
}

.typing-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 4px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

/* Input Area */
.input-container {
  padding: 20px 24px;
  background: rgba(26, 26, 46, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.message-input:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.message-input::placeholder {
  color: #6b7280;
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.input-footer {
  text-align: center;
}

.input-footer p {
  margin: 0;
  font-size: 10px;
  color: #6b7280;
  line-height: 1.3;
}

/* Animations */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes typingBounce {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Scrollbar Styling */
.chat-container::-webkit-scrollbar {
  width: 4px;
}

.chat-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive Design */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-content {
    height: 90vh;
    max-height: none;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .chat-container {
    padding: 16px;
  }

  .input-container {
    padding: 16px 20px;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .message-content {
    max-width: 85%;
  }
}

/* Focus states for accessibility */
.message-input:focus-visible,
.send-btn:focus-visible,
.close-btn:focus-visible,
.quick-action-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>

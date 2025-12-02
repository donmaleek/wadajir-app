<template>
  <!-- AI Agent Floating Button -->
  <div class="ai-agent-container">
    <!-- Main AI Button -->
    <div
      class="ai-floating-btn"
      :class="{ active: isOpen, pulsing: hasNewMessage }"
      @click="toggleAIAgent"
    >
      <div class="ai-avatar">
        <div class="ai-glow"></div>
        <i class="fa-solid fa-robot text-white text-lg"></i>
        <div v-if="isOnline" class="online-indicator"></div>
      </div>
      <div class="ai-pulse-ring"></div>
    </div>

    <!-- AI Chat Interface -->
    <div v-if="isOpen" class="ai-chat-interface">
      <!-- Header -->
      <div class="ai-chat-header">
        <div class="flex items-center gap-3">
          <div class="ai-agent-avatar">
            <div class="ai-agent-glow"></div>
            <i class="fa-solid fa-brain text-white text-xl"></i>
          </div>
          <div>
            <h3 class="text-white font-bold">Wadajir AI</h3>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-green-400 text-xs">Online • 2025 AI</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="toggleVoice" class="ai-header-btn" :class="{ active: isVoiceActive }">
            <i
              class="fa-solid"
              :class="isVoiceActive ? 'fa-microphone' : 'fa-microphone-slash'"
            ></i>
          </button>
          <button @click="clearChat" class="ai-header-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button @click="isOpen = false" class="ai-header-btn">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="ai-chat-messages" ref="chatMessages">
        <div
          v-for="(message, index) in chatHistory"
          :key="index"
          class="message"
          :class="message.type"
        >
          <div class="message-avatar">
            <i v-if="message.type === 'ai'" class="fa-solid fa-robot text-purple-400"></i>
            <i v-else class="fa-solid fa-user text-blue-400"></i>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.text)"></div>
            <div class="message-time">{{ message.time }}</div>

            <!-- Quick Actions for AI Messages -->
            <div v-if="message.type === 'ai' && message.quickActions" class="quick-actions">
              <button
                v-for="(action, actionIndex) in message.quickActions"
                :key="actionIndex"
                @click="handleQuickAction(action)"
                class="quick-action-btn"
              >
                {{ action.text }}
              </button>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message ai typing">
          <div class="message-avatar">
            <i class="fa-solid fa-robot text-purple-400"></i>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Access Buttons -->
      <div v-if="showQuickAccess" class="quick-access-grid">
        <button
          v-for="(action, index) in quickAccessActions"
          :key="index"
          @click="handleQuickAction(action)"
          class="quick-access-btn"
        >
          <i :class="action.icon" class="text-lg mb-1"></i>
          <span class="text-xs">{{ action.text }}</span>
        </button>
      </div>

      <!-- Input Area -->
      <div class="ai-input-area">
        <div class="ai-input-container">
          <input
            v-model="userInput"
            @keypress.enter="sendMessage"
            type="text"
            :placeholder="
              isAuthenticated
                ? 'Ask me anything about trading...'
                : 'Ask about our platform or how to get started...'
            "
            class="ai-input"
            :disabled="isTyping"
          />
          <div class="ai-input-actions">
            <button @click="toggleVoice" class="ai-input-btn" :class="{ recording: isRecording }">
              <i
                class="fa-solid"
                :class="isRecording ? 'fa-circle-stop text-red-400' : 'fa-microphone'"
              ></i>
            </button>
            <button
              @click="sendMessage"
              class="ai-input-btn send-btn"
              :disabled="!userInput.trim()"
            >
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <!-- Voice Recording Visualizer -->
        <div v-if="isRecording" class="voice-visualizer">
          <div class="visualizer-bars">
            <div v-for="n in 8" :key="n" class="visualizer-bar" :style="getBarStyle(n)"></div>
          </div>
          <span class="text-red-400 text-xs">Listening... {{ recordingTime }}s</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '../../stores/auth'
// Auth store
const authStore = useAuthStore()
const { isAuthenticated } = authStore

// State
const isOpen = ref(false)
const isOnline = ref(true)
const hasNewMessage = ref(false)
const isTyping = ref(false)
const isVoiceActive = ref(false)
const isRecording = ref(false)
const showQuickAccess = ref(true)
const userInput = ref('')
const chatMessages = ref<HTMLElement>()
const recordingTime = ref(0)

// Chat history
const chatHistory = ref<
  Array<{
    type: 'user' | 'ai'
    text: string
    time: string
    quickActions?: Array<{ text: string; action: string }>
  }>
>([])

// Quick access actions - dynamic based on authentication
const quickAccessActions = computed(() => {
  if (!isAuthenticated.value) {
    return [
      { icon: 'fa-solid fa-rocket', text: 'Features', action: 'platform_features' },
      { icon: 'fa-solid fa-play', text: 'Get Started', action: 'how_to_start' },
      { icon: 'fa-solid fa-shield', text: 'Security', action: 'security_info' },
      { icon: 'fa-solid fa-gem', text: 'Benefits', action: 'platform_benefits' },
      { icon: 'fa-solid fa-question', text: 'Help', action: 'help_guide' },
      { icon: 'fa-solid fa-user-plus', text: 'Register', action: 'register' },
    ]
  } else {
    return [
      { icon: 'fa-solid fa-chart-line', text: 'Market Analysis', action: 'analyze_market' },
      { icon: 'fa-solid fa-lightbulb', text: 'Trading Tips', action: 'trading_tips' },
      { icon: 'fa-solid fa-shield', text: 'Security Check', action: 'security_check' },
      { icon: 'fa-solid fa-coins', text: 'Portfolio Advice', action: 'portfolio_advice' },
      { icon: 'fa-solid fa-bolt', text: 'Quick Trade', action: 'quick_trade' },
      { icon: 'fa-solid fa-question', text: 'Help Guide', action: 'help_guide' },
    ]
  }
})

// Voice recording interval
let recordingInterval: number | null = null

// Computed
const currentTime = computed(() => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
})

// Methods
const toggleAIAgent = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasNewMessage.value = false
    // Auto welcome message - contextual based on authentication
    if (chatHistory.value.length === 0) {
      const welcomeMessage = !isAuthenticated.value
        ? "Welcome to Wadajir! 🚀 I'm your AI assistant. I can help you learn about cryptocurrency trading, understand our platform features, and guide you through the registration process. What would you like to know?"
        : "Hello! I'm your Wadajir AI assistant. I can help you with trading analysis, market insights, portfolio management, and more. How can I assist you today?"

      const quickActions = !isAuthenticated.value
        ? [
            { text: 'Platform Features', action: 'platform_features' },
            { text: 'How to Start', action: 'how_to_start' },
            { text: 'Security Info', action: 'security_info' },
          ]
        : [
            { text: 'Market Analysis', action: 'analyze_market' },
            { text: 'Trading Tips', action: 'trading_tips' },
            { text: 'Portfolio Review', action: 'portfolio_review' },
          ]

      addAIMessage(welcomeMessage, quickActions)
    }
  }
}

const toggleVoice = () => {
  if (!isVoiceActive.value) {
    startVoiceRecognition()
  } else {
    stopVoiceRecognition()
  }
}

const startVoiceRecognition = () => {
  isVoiceActive.value = true
  isRecording.value = true
  recordingTime.value = 0

  recordingInterval = setInterval(() => {
    recordingTime.value++
    if (recordingTime.value >= 30) {
      // Auto stop after 30 seconds
      stopVoiceRecognition()
    }
  }, 1000)

  // Simulate voice recognition
  setTimeout(() => {
    if (isRecording.value) {
      if (!isAuthenticated.value) {
        userInput.value = 'What features does Wadajir offer?'
      } else {
        userInput.value = 'Show me the current Bitcoin market analysis'
      }
      sendMessage()
    }
  }, 2000)
}

const stopVoiceRecognition = () => {
  isVoiceActive.value = false
  isRecording.value = false
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
}

const getBarStyle = (index: number) => {
  const height = 5 + Math.random() * 20
  const delay = index * 0.1
  return {
    height: `${height}px`,
    animationDelay: `${delay}s`,
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return

  const userMessage = userInput.value.trim()
  addUserMessage(userMessage)
  userInput.value = ''

  // Simulate AI thinking
  isTyping.value = true
  showQuickAccess.value = false

  // Simulate API call delay
  setTimeout(
    () => {
      generateAIResponse(userMessage)
      isTyping.value = false
      showQuickAccess.value = true
    },
    1500 + Math.random() * 1000,
  )
}

const addUserMessage = (text: string) => {
  chatHistory.value.push({
    type: 'user',
    text,
    time: currentTime.value,
  })
  scrollToBottom()
}

const addAIMessage = (text: string, quickActions?: Array<{ text: string; action: string }>) => {
  chatHistory.value.push({
    type: 'ai',
    text,
    time: currentTime.value,
    quickActions,
  })
  scrollToBottom()
  hasNewMessage.value = true
}

const generateAIResponse = (userMessage: string) => {
  const lowerMessage = userMessage.toLowerCase()

  // Landing page specific responses
  if (!isAuthenticated.value) {
    if (
      lowerMessage.includes('feature') ||
      lowerMessage.includes('what can') ||
      lowerMessage.includes('platform')
    ) {
      addAIMessage(
        `Wadajir offers incredible features for your trading journey! 🌟<br><br>
        <strong>Key Platform Features:</strong><br>
        • <strong>Advanced Trading</strong> - Spot, margin, and futures trading<br>
        • <strong>AI-Powered Insights</strong> - Real-time market analysis (that's me!)<br>
        • <strong>Portfolio Management</strong> - Track and optimize your investments<br>
        • <strong>Security First</strong> - Bank-level encryption and protection<br>
        • <strong>Mobile Friendly</strong> - Trade anywhere, anytime<br>
        • <strong>24/7 Support</strong> - Always here to help you<br><br>
        Ready to start your trading journey?`,
        [
          { text: 'Register Now', action: 'register' },
          { text: 'Learn More', action: 'learn_more' },
          { text: 'Security Details', action: 'security_details' },
        ],
      )
    } else if (
      lowerMessage.includes('start') ||
      lowerMessage.includes('begin') ||
      lowerMessage.includes('how to')
    ) {
      addAIMessage(
        `Getting started with Wadajir is easy! 🎯<br><br>
        <strong>Simple 3-Step Process:</strong><br>
        1. <strong>Register</strong> - Create your account in under 2 minutes<br>
        2. <strong>Verify</strong> - Complete quick identity verification<br>
        3. <strong>Fund & Trade</strong> - Deposit and start trading!<br><br>
        <strong>What you'll need:</strong><br>
        • Email address<br>
        • Government ID for verification<br>
        • Minimum deposit: $10<br><br>
        I can help you through each step!`,
        [
          { text: 'Start Registration', action: 'start_register' },
          { text: 'Verification Help', action: 'verification_help' },
          { text: 'Funding Options', action: 'funding_options' },
        ],
      )
    } else if (
      lowerMessage.includes('security') ||
      lowerMessage.includes('safe') ||
      lowerMessage.includes('protect')
    ) {
      addAIMessage(
        `Your security is our top priority! 🔒<br><br>
        <strong>Wadajir Security Features:</strong><br>
        • <strong>Bank-Level Encryption</strong> - All data encrypted in transit and at rest<br>
        • <strong>2FA Protection</strong> - Two-factor authentication for all accounts<br>
        • <strong>Cold Storage</strong> - 95% of funds in offline cold wallets<br>
        • <strong>Insurance</strong> - Digital asset insurance coverage<br>
        • <strong>24/7 Monitoring</strong> - Real-time threat detection<br>
        • <strong>Regulatory Compliance</strong> - Fully licensed and regulated<br><br>
        We've never had a security breach!`,
        [
          { text: 'Security Tips', action: 'security_tips' },
          { text: '2FA Setup', action: '2fa_setup' },
          { text: 'Trust & Verify', action: 'trust_verify' },
        ],
      )
    } else if (
      lowerMessage.includes('benefit') ||
      lowerMessage.includes('advantage') ||
      lowerMessage.includes('why')
    ) {
      addAIMessage(
        `Why choose Wadajir? Here are the key benefits: 💎<br><br>
        <strong>Competitive Advantages:</strong><br>
        • <strong>Lowest Fees</strong> - Industry-leading 0.1% trading fee<br>
        • <strong>Lightning Fast</strong> - Execute trades in milliseconds<br>
        • <strong>AI Assistant</strong> - 24/7 personalized guidance (that's me!)<br>
        • <strong>Global Access</strong> - Trade from anywhere in the world<br>
        • <strong>Educational Resources</strong> - Learn while you earn<br>
        • <strong>Community</strong> - Join 50,000+ successful traders<br><br>
        Start your journey with the best in the business!`,
        [
          { text: 'See Pricing', action: 'see_pricing' },
          { text: 'Success Stories', action: 'success_stories' },
          { text: 'Join Now', action: 'join_now' },
        ],
      )
    } else {
      // Default response for landing page
      addAIMessage(
        `I understand you're asking about "${userMessage}". As your AI guide, I can help you:<br><br>
        • Learn about Wadajir's trading platform features<br>
        • Understand how to get started with cryptocurrency<br>
        • Explore security measures and protection<br>
        • Answer questions about registration and verification<br>
        • Provide educational resources for beginners<br><br>
        What specific information would you like?`,
        [
          { text: 'Platform Tour', action: 'platform_tour' },
          { text: 'Get Started', action: 'get_started' },
          { text: 'Ask Question', action: 'ask_question' },
        ],
      )
    }
  } else {
    // Home page responses for authenticated users
    if (lowerMessage.includes('analysis') || lowerMessage.includes('market')) {
      addAIMessage(
        `Based on current market data, I'm detecting strong bullish momentum in the crypto market. 📈<br><br>
        <strong>Key Insights:</strong><br>
        • BTC showing 5% upward movement in 24h<br>
        • ETH breaking resistance at $3,050<br>
        • High trading volume across major pairs<br><br>
        Would you like me to provide a detailed technical analysis or set up price alerts?`,
        [
          { text: 'Detailed Analysis', action: 'detailed_analysis' },
          { text: 'Set Alerts', action: 'set_alerts' },
          { text: 'Trade Now', action: 'quick_trade' },
        ],
      )
    } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('balance')) {
      addAIMessage(
        `Your portfolio is performing well! 🎯<br><br>
        <strong>Portfolio Summary:</strong><br>
        • Total Value: <strong>$12,458.32</strong><br>
        • 24h Change: <span class="text-green-400">+2.34%</span><br>
        • Best Performer: SOL +4.2%<br><br>
        I recommend considering some profit-taking on SOL and diversifying into emerging DeFi tokens.`,
        [
          { text: 'Rebalance', action: 'rebalance_portfolio' },
          { text: 'Diversify', action: 'diversify' },
          { text: 'Performance Report', action: 'performance_report' },
        ],
      )
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      addAIMessage(
        `I'm here to help! Here's what I can assist you with:<br><br>
        🔍 <strong>Market Analysis</strong> - Real-time insights and predictions<br>
        💼 <strong>Portfolio Management</strong> - Optimization and rebalancing<br>
        🛡️ <strong>Security</strong> - Account protection and best practices<br>
        📊 <strong>Trading</strong> - Strategy suggestions and execution<br>
        🎯 <strong>Education</strong> - Learning resources and guides<br><br>
        What specific area would you like help with?`,
      )
    } else {
      addAIMessage(
        `I understand you're asking about "${userMessage}". As your AI trading assistant, I can help you with:<br><br>
        • Real-time market analysis and predictions<br>
        • Portfolio optimization strategies<br>
        • Risk management and security tips<br>
        • Trading execution and automation<br>
        • Educational content and market news<br><br>
        Could you be more specific about what you'd like to know?`,
        [
          { text: 'Market Analysis', action: 'analyze_market' },
          { text: 'Portfolio Help', action: 'portfolio_help' },
          { text: 'Trading Guide', action: 'trading_guide' },
        ],
      )
    }
  }
}

const handleQuickAction = (action: { text: string; action: string }) => {
  // Landing page specific actions
  if (!isAuthenticated.value) {
    switch (action.action) {
      case 'register':
      case 'start_register':
      case 'join_now':
        addAIMessage(
          "Great choice! 🎉 Let's get you registered. Click the 'Register' button at the top of the page to create your account. I'll be here to guide you through the verification process once you're signed up!",
          [
            { text: 'Registration Help', action: 'registration_help' },
            { text: 'Verification Info', action: 'verification_info' },
          ],
        )
        break
      case 'platform_features':
        userInput.value = 'What features does Wadajir offer?'
        sendMessage()
        break
      case 'security_info':
        userInput.value = 'How secure is Wadajir?'
        sendMessage()
        break
      case 'how_to_start':
        userInput.value = 'How do I get started?'
        sendMessage()
        break
      default:
        userInput.value = action.text
        sendMessage()
    }
  } else {
    // Home page actions
    switch (action.action) {
      case 'analyze_market':
        addAIMessage(
          `Let me analyze the current market conditions... 📊<br><br>
          <strong>Market Overview:</strong><br>
          • Overall Sentiment: <span class="text-green-400">Bullish</span><br>
          • BTC Dominance: 42.3%<br>
          • Fear & Greed Index: 68 (Greed)<br>
          • Top Gainers: SOL, AVAX, DOT<br><br>
          Would you like a detailed technical analysis of any specific asset?`,
          [
            { text: 'BTC Analysis', action: 'btc_analysis' },
            { text: 'ETH Analysis', action: 'eth_analysis' },
            { text: 'Market Trends', action: 'market_trends' },
          ],
        )
        break
      case 'trading_tips':
        addAIMessage(
          `Here are some pro trading tips for today: 💡<br><br>
          <strong>Daily Trading Tips:</strong><br>
          • Watch for BTC dominance shifts<br>
          • Consider accumulating during dips<br>
          • Set stop-losses at key support levels<br>
          • Diversify across large and mid-cap tokens<br>
          • Monitor regulatory news closely<br><br>
          Remember: Never invest more than you can afford to lose!`,
        )
        break
      case 'quick_trade':
        addAIMessage(
          `I can help you execute trades quickly! 🚀<br><br>
          Which asset would you like to trade?<br>
          • BTC/USDT<br>
          • ETH/USDT<br>
          • SOL/USDT<br>
          • ADA/USDT<br><br>
          Just tell me "Buy 0.1 BTC" or "Sell 2 ETH" and I'll handle it!`,
        )
        break
      default:
        userInput.value = action.text
        sendMessage()
    }
  }
}

const clearChat = () => {
  chatHistory.value = []
  const welcomeMessage = !isAuthenticated.value
    ? "Chat cleared! I'm ready to help you learn about Wadajir and cryptocurrency trading. What would you like to know?"
    : "Chat cleared! I'm ready to help you with your trading journey. What would you like to know?"

  const quickActions = !isAuthenticated.value
    ? [
        { text: 'Platform Features', action: 'platform_features' },
        { text: 'Get Started', action: 'how_to_start' },
        { text: 'Security Info', action: 'security_info' },
      ]
    : [
        { text: 'Market Update', action: 'market_update' },
        { text: 'Portfolio Review', action: 'portfolio_review' },
        { text: 'Trading Strategy', action: 'trading_strategy' },
      ]

  addAIMessage(welcomeMessage, quickActions)
}

const formatMessage = (text: string) => {
  return text.replace(/\n/g, '<br>')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  })
}

// Lifecycle
onMounted(() => {
  // Simulate occasional AI notifications
  setInterval(() => {
    if (!isOpen.value && Math.random() > 0.7) {
      hasNewMessage.value = true
    }
  }, 30000)
})

onUnmounted(() => {
  if (recordingInterval) {
    clearInterval(recordingInterval)
  }
})
</script>

<style scoped>
/* [Keep all the same CSS styles from the previous ModernAIAgent.vue] */
.ai-agent-container {
  position: fixed;
  bottom: 120px;
  right: 20px;
  z-index: 1000;
}

/* Floating Button */
.ai-floating-btn {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.ai-floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
}

.ai-floating-btn.active {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.ai-floating-btn.pulsing {
  animation: pulse-glow 2s infinite;
}

.ai-avatar {
  position: relative;
  z-index: 2;
}

.ai-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  filter: blur(15px);
  opacity: 0.6;
  animation: glow-pulse 3s infinite;
}

.online-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid #1f2937;
  border-radius: 50%;
  animation: ping 2s infinite;
}

.ai-pulse-ring {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid #667eea;
  border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

/* Chat Interface */
.ai-chat-interface {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 600px;
  background: rgba(17, 17, 31, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-chat-header {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-agent-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-agent-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  filter: blur(10px);
  opacity: 0.4;
}

.ai-header-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-header-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.ai-header-btn.active {
  background: #ef4444;
  color: white;
}

/* Chat Messages */
.ai-chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  animation: messageSlide 0.3s ease;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.message-text {
  color: white;
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.quick-action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

/* Quick Access Grid */
.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 0 20px 20px;
}

.quick-access-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.quick-access-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Input Area */
.ai-input-area {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.ai-input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ai-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
}

.ai-input::placeholder {
  color: #9ca3af;
}

.ai-input-actions {
  display: flex;
  gap: 4px;
}

.ai-input-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-input-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.ai-input-btn.recording {
  background: #ef4444;
  color: white;
  animation: pulse 1s infinite;
}

.send-btn:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Voice Visualizer */
.voice-visualizer {
  margin-top: 12px;
  text-align: center;
}

.visualizer-bars {
  display: flex;
  gap: 2px;
  justify-content: center;
  align-items: end;
  height: 30px;
  margin-bottom: 8px;
}

.visualizer-bar {
  width: 4px;
  background: #ef4444;
  border-radius: 2px;
  animation: visualizer-pulse 0.5s infinite alternate;
}

/* Animations */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6);
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing-bounce {
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

@keyframes visualizer-pulse {
  from {
    height: 5px;
  }
  to {
    height: 25px;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Scrollbar Styling */
.ai-chat-messages::-webkit-scrollbar {
  width: 4px;
}

.ai-chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.ai-chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.ai-chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>

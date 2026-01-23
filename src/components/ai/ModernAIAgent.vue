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
        <i class="fa-solid fa-sparkles text-white text-lg"></i>
        <div v-if="isOnline" class="online-indicator"></div>
      </div>
      <div class="ai-pulse-ring"></div>
    </div>

    <!-- AI Chat Interface -->
    <transition name="ai-slide">
      <div v-if="isOpen" class="ai-chat-interface">
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="flex items-center gap-3">
            <div class="ai-agent-avatar">
              <div class="ai-agent-glow"></div>
              <i class="fa-solid fa-crown text-yellow-400 text-xl"></i>
            </div>
            <div>
              <h3 class="text-white font-bold">Golden Rise AI</h3>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-green-400 text-xs">Online • Mining AI</span>
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
            <button @click="toggleTheme" class="ai-header-btn">
              <i class="fa-solid" :class="isDarkTheme ? 'fa-sun' : 'fa-moon'"></i>
            </button>
            <button @click="clearChat" class="ai-header-btn">
              <i class="fa-solid fa-trash"></i>
            </button>
            <button @click="closeChat" class="ai-header-btn close-btn">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- AI Status Bar -->
        <div class="ai-status-bar">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-300">Mining Power:</span>
            <div class="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                :style="{ width: processingPower + '%' }"
              ></div>
            </div>
            <span class="text-xs text-yellow-400">{{ processingPower }}%</span>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="ai-chat-messages" ref="chatMessages">
          <!-- Welcome Message -->
          <div v-if="showWelcome && chatHistory.length === 0" class="welcome-message">
            <div class="welcome-avatar">
              <i class="fa-solid fa-crown text-yellow-400"></i>
            </div>
            <div class="welcome-content">
              <div class="welcome-text">
                <h4 class="font-bold text-lg mb-2">Welcome to Golden Rise AI</h4>
                <p class="text-sm text-gray-300 mb-3">
                  Your intelligent mining companion powered by advanced AI technology for maximum
                  profits.
                </p>

                <!-- Capabilities Grid -->
                <div class="capabilities-grid">
                  <div class="capability-item">
                    <i class="fa-solid fa-robot text-yellow-400"></i>
                    <span>AI Mining Bots</span>
                  </div>
                  <div class="capability-item">
                    <i class="fa-solid fa-bolt text-green-400"></i>
                    <span>Profit Prediction</span>
                  </div>
                  <div class="capability-item">
                    <i class="fa-solid fa-coins text-orange-400"></i>
                    <span>Portfolio AI</span>
                  </div>
                  <div class="capability-item">
                    <i class="fa-solid fa-chart-line text-purple-400"></i>
                    <span>Market Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Messages -->
          <div
            v-for="(message, index) in chatHistory"
            :key="index"
            class="message"
            :class="message.type"
          >
            <div class="message-avatar">
              <i v-if="message.type === 'ai'" class="fa-solid fa-crown text-yellow-400"></i>
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
                  <i :class="action.icon" class="mr-1"></i>
                  {{ action.text }}
                </button>
              </div>

              <!-- Mining Data for Messages -->
              <div v-if="message.miningData" class="mining-data">
                <div class="mining-data-item">
                  <span class="label">Daily Profit:</span>
                  <span class="value text-green-400">{{ message.miningData.profit }}</span>
                </div>
                <div class="mining-data-item">
                  <span class="label">Bot Efficiency:</span>
                  <span
                    class="value"
                    :class="message.miningData.efficiency >= 0 ? 'text-green-400' : 'text-red-400'"
                  >
                    {{ message.miningData.efficiency >= 0 ? '+' : ''
                    }}{{ message.miningData.efficiency }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="message ai typing">
            <div class="message-avatar">
              <i class="fa-solid fa-crown text-yellow-400"></i>
            </div>
            <div class="message-content">
              <div class="typing-indicator">
                <span>AI is analyzing...</span>
                <div class="dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Access Buttons -->
        <transition name="fade-slide">
          <div v-if="showQuickAccess && chatHistory.length > 0" class="quick-access-grid">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <button
                v-for="(action, index) in quickAccessActions"
                :key="index"
                @click="handleQuickAction(action)"
                class="quick-access-btn"
                :style="{ '--gradient-color': action.gradient }"
              >
                <i :class="action.icon" class="text-lg mb-1"></i>
                <span class="text-xs font-medium">{{ action.text }}</span>
              </button>
            </div>
          </div>
        </transition>

        <!-- Input Area -->
        <div class="ai-input-area">
          <!-- Enhanced Input Container -->
          <div class="ai-input-container">
            <div class="ai-input-wrapper">
              <input
                v-model="userInput"
                @keypress.enter="sendMessage"
                type="text"
                :placeholder="
                  isAuthenticated
                    ? 'Ask AI about mining strategies, bot upgrades, or profit analysis...'
                    : 'Ask about mining features, bot benefits, or how to start mining...'
                "
                class="ai-input"
                :disabled="isTyping"
              />
              <div class="ai-input-hints">
                <span class="hint-text">Try: "Best mining bot" or "Profit tips"</span>
              </div>
            </div>
            <div class="ai-input-actions">
              <button @click="attachFile" class="ai-input-btn attach-btn">
                <i class="fa-solid fa-paperclip"></i>
              </button>
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
          <transition name="fade-slide">
            <div v-if="isRecording" class="voice-visualizer">
              <div class="visualizer-bars">
                <div v-for="n in 12" :key="n" class="visualizer-bar" :style="getBarStyle(n)"></div>
              </div>
              <div class="voice-info">
                <span class="text-red-400 text-sm font-medium"
                  >Listening... {{ recordingTime }}s</span
                >
                <button @click="stopVoiceRecognition" class="stop-btn">
                  <i class="fa-solid fa-stop"></i>
                </button>
              </div>
            </div>
          </transition>

          <!-- Suggested Prompts -->
          <div v-if="showPrompts" class="suggested-prompts">
            <div class="prompts-header">
              <span class="text-xs text-gray-400">Suggested Prompts</span>
            </div>
            <div class="prompts-grid">
              <button
                v-for="prompt in suggestedPrompts"
                :key="prompt"
                @click="usePrompt(prompt)"
                class="prompt-btn"
              >
                {{ prompt }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Notification Badge -->
    <transition name="fade">
      <div v-if="hasNewMessage && !isOpen" class="ai-notification-badge">
        <span class="notification-text">New AI Insight!</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '../../stores/auth'

// Auth store
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

// State
const isOpen = ref(false)
const isOnline = ref(true)
const hasNewMessage = ref(false)
const isTyping = ref(false)
const isVoiceActive = ref(false)
const isRecording = ref(false)
const isDarkTheme = ref(true)
const showQuickAccess = ref(true)
const showWelcome = ref(true)
const showPrompts = ref(true)
const processingPower = ref(85)
const userInput = ref('')
const chatMessages = ref<HTMLElement>()
const recordingTime = ref(0)

// Chat history
const chatHistory = ref<
  Array<{
    type: 'user' | 'ai'
    text: string
    time: string
    quickActions?: Array<{ text: string; action: string; icon: string }>
    miningData?: { profit: string; efficiency: number }
  }>
>([])

// Quick access actions - dynamic based on authentication
const quickAccessActions = computed(() => {
  if (!isAuthenticated.value) {
    return [
      {
        icon: 'fa-solid fa-robot',
        text: 'AI Bots',
        action: 'ai_bots',
        gradient: '#f59e0b, #d97706',
      },
      {
        icon: 'fa-solid fa-play',
        text: 'Start Mining',
        action: 'start_mining',
        gradient: '#10b981, #059669',
      },
      {
        icon: 'fa-solid fa-shield',
        text: 'Security',
        action: 'security_info',
        gradient: '#8b5cf6, #7c3aed',
      },
      {
        icon: 'fa-solid fa-gem',
        text: 'Benefits',
        action: 'mining_benefits',
        gradient: '#f97316, #ea580c',
      },
      {
        icon: 'fa-solid fa-question',
        text: 'Help',
        action: 'help_guide',
        gradient: '#0ea5e9, #0284c7',
      },
      {
        icon: 'fa-solid fa-user-plus',
        text: 'Register',
        action: 'register',
        gradient: '#ec4899, #db2777',
      },
    ]
  } else {
    return [
      {
        icon: 'fa-solid fa-chart-line',
        text: 'Mining AI',
        action: 'analyze_mining',
        gradient: '#f59e0b, #d97706',
      },
      {
        icon: 'fa-solid fa-lightbulb',
        text: 'Profit Tips',
        action: 'profit_tips',
        gradient: '#10b981, #059669',
      },
      {
        icon: 'fa-solid fa-shield',
        text: 'Risk AI',
        action: 'security_check',
        gradient: '#8b5cf6, #7c3aed',
      },
      {
        icon: 'fa-solid fa-coins',
        text: 'Portfolio AI',
        action: 'portfolio_advice',
        gradient: '#f97316, #ea580c',
      },
      {
        icon: 'fa-solid fa-bolt',
        text: 'Auto Mine',
        action: 'auto_mine',
        gradient: '#0ea5e9, #0284c7',
      },
      {
        icon: 'fa-solid fa-crown',
        text: 'VIP AI',
        action: 'vip_ai',
        gradient: '#ec4899, #db2777',
      },
    ]
  }
})

// Suggested prompts
const suggestedPrompts = computed(() => {
  if (!isAuthenticated.value) {
    return [
      'How to start mining?',
      'What are AI mining bots?',
      'How much can I earn?',
      'Is mining profitable?',
    ]
  } else {
    return ['Upgrade bots', 'Check profits', 'Portfolio advice', 'Best mining strategy']
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
    // Auto welcome message
    if (chatHistory.value.length === 0) {
      const welcomeMessage = !isAuthenticated.value
        ? "👑 **Welcome to Golden Rise AI!** I'm your intelligent mining assistant. I can help you:<br><br>• Learn about AI mining bots<br>• Understand profit potential<br>• Get step-by-step guidance<br>• Explore mining strategies<br><br>**What would you like to explore today?**"
        : '🤖 **Golden Rise Mining AI Online**<br><br>**Advanced Capabilities:**<br>• AI mining bot optimization<br>• Profit prediction analysis<br>• Portfolio growth strategies<br>• Risk assessment algorithms<br><br>**How can I maximize your mining profits today?**'

      const quickActions = !isAuthenticated.value
        ? [
            { text: 'Mining Tour', action: 'mining_tour', icon: 'fa-solid fa-compass' },
            { text: 'Start Guide', action: 'start_guide', icon: 'fa-solid fa-play' },
            { text: 'Profit Calculator', action: 'profit_calc', icon: 'fa-solid fa-calculator' },
          ]
        : [
            { text: 'Bot AI', action: 'bot_ai', icon: 'fa-solid fa-robot' },
            { text: 'Profit AI', action: 'profit_ai', icon: 'fa-solid fa-coins' },
            { text: 'Upgrade AI', action: 'upgrade_ai', icon: 'fa-solid fa-crown' },
          ]

      addAIMessage(welcomeMessage, quickActions)
    }
  }
}

const closeChat = () => {
  isOpen.value = false
  // Reset voice if active
  if (isVoiceActive.value) {
    stopVoiceRecognition()
  }
}

const toggleVoice = () => {
  if (!isVoiceActive.value) {
    startVoiceRecognition()
  } else {
    stopVoiceRecognition()
  }
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
}

const startVoiceRecognition = () => {
  isVoiceActive.value = true
  isRecording.value = true
  recordingTime.value = 0

  recordingInterval = setInterval(() => {
    recordingTime.value++
    if (recordingTime.value >= 30) {
      stopVoiceRecognition()
    }
  }, 1000)

  // Simulate voice recognition with enhanced responses
  setTimeout(() => {
    if (isRecording.value) {
      if (!isAuthenticated.value) {
        userInput.value = 'Tell me about Golden Rise mining'
      } else {
        userInput.value = 'Analyze my mining profits'
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
  const height = 8 + Math.random() * 25
  const delay = index * 0.08
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
  showPrompts.value = false

  // Simulate AI thinking with processing animation
  isTyping.value = true
  showQuickAccess.value = false

  // Animate processing power
  const processingInterval = setInterval(() => {
    processingPower.value = Math.min(100, processingPower.value + Math.random() * 15)
  }, 100)

  // Simulate AI response
  setTimeout(
    () => {
      clearInterval(processingInterval)
      generateEnhancedAIResponse(userMessage)
      isTyping.value = false
      showQuickAccess.value = true
      showPrompts.value = true
      processingPower.value = 85
    },
    1800 + Math.random() * 1200,
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

const addAIMessage = (
  text: string,
  quickActions?: Array<{ text: string; action: string; icon: string }>,
  miningData?: { profit: string; efficiency: number },
) => {
  chatHistory.value.push({
    type: 'ai',
    text,
    time: currentTime.value,
    quickActions,
    miningData,
  })
  scrollToBottom()
  hasNewMessage.value = true
}

// Helper functions for random data
const getRandomBalance = () => {
  return (Math.random() * 10000 + 1000).toFixed(2)
}

const getRandomProfit = () => {
  return (Math.random() * 100 + 50).toFixed(2)
}

const getRandomBots = () => {
  return Math.floor(Math.random() * 3 + 1)
}

const getRandomProjected = () => {
  return (Math.random() * 3000 + 1000).toFixed(0)
}

const getRandomEfficiency = () => {
  return Math.floor(Math.random() * 30 + 70)
}

const getCurrentBotLevel = () => {
  const levels = ['Basic', 'Pro', 'Expert', 'VIP']
  return levels[Math.floor(Math.random() * 2)]
}

const getTargetBotLevel = () => {
  const levels = ['Pro', 'Expert', 'VIP']
  return levels[Math.floor(Math.random() * 2) + 1]
}

const getUpgradeCost = () => {
  const costs = [299, 699, 1299, 2999]
  return costs[Math.floor(Math.random() * 2) + 1]
}

const getProfitIncrease = () => {
  return (Math.random() * 50 + 20).toFixed(0)
}

const getROIPeriod = () => {
  return Math.floor(Math.random() * 30 + 15)
}

const getGracePeriod = () => {
  const periods = [7, 14, 30, 60]
  return periods[Math.floor(Math.random() * 3) + 1]
}

const generateEnhancedAIResponse = (userMessage: string) => {
  const lowerMessage = userMessage.toLowerCase()

  if (!isAuthenticated.value) {
    // Landing page enhanced responses
    if (lowerMessage.includes('mining') || lowerMessage.includes('bot')) {
      addAIMessage(
        `🤖 **Golden Rise AI Mining Bots**<br><br>
        **Advanced AI Mining Features:**<br>
        👑 **Scalper Pro** - 5-8% monthly ROI<br>
        👑 **Swing Master** - 12-18% monthly ROI<br>
        👑 **Arbitrage Pro** - 20-30% monthly ROI<br>
        👑 **AI Master** - 35-50% monthly ROI<br><br>
        **Why choose Golden Rise?**<br>
        • Guaranteed monthly profits<br>
        • 24/7 automated mining<br>
        • AI-powered optimization<br>
        • VIP support & guidance<br><br>
        Ready to start AI mining?`,
        [
          { text: 'View Bots', action: 'view_bots', icon: 'fa-solid fa-eye' },
          { text: 'Start Free', action: 'start_free', icon: 'fa-solid fa-rocket' },
          { text: 'Profit Calc', action: 'profit_calc', icon: 'fa-solid fa-calculator' },
        ],
        { profit: '$299+ daily', efficiency: 25 },
      )
    } else if (lowerMessage.includes('profit') || lowerMessage.includes('earn')) {
      addAIMessage(
        `💰 **Profit Potential Analysis**<br><br>
        **AI Mining Profit Calculator:**<br>
        • **Basic Bot:** $299 → $15-24/day profit<br>
        • **Pro Bot:** $699 → $35-42/day profit<br>
        • **Expert Bot:** $1,299 → $85-130/day profit<br>
        • **VIP Bot:** $2,999 → $350-500/day profit<br><br>
        **Key Benefits:**<br>
        • 7-60 day grace periods<br>
        • Guaranteed ROI rates<br>
        • Automated mining<br>
        • Real-time profit tracking<br><br>
        **Start your mining journey today!**`,
        [
          { text: 'Calculate', action: 'calculate', icon: 'fa-solid fa-calculator' },
          { text: 'Compare', action: 'compare', icon: 'fa-solid fa-chart-bar' },
          { text: 'Get Started', action: 'get_started', icon: 'fa-solid fa-play-circle' },
        ],
        { profit: '$299+ daily', efficiency: 30 },
      )
    } else {
      // Default enhanced response
      addAIMessage(
        `💡 **AI Mining Insight Detected**<br><br>
        I've analyzed your query about **"${userMessage}"** and here's what I can provide:<br><br>
        **Immediate Assistance:**<br>
        • Complete mining setup guide<br>
        • Bot selection strategy<br>
        • Profit optimization tips<br>
        • Risk management plan<br><br>
        **AI-Powered Analysis:**<br>
        • Portfolio growth predictions<br>
        • Bot efficiency optimization<br>
        • Market timing strategies<br><br>
        **What specific area would you like me to focus on?**`,
        [
          { text: 'Quick Start', action: 'quick_start', icon: 'fa-solid fa-bolt' },
          { text: 'AI Guide', action: 'ai_guide', icon: 'fa-solid fa-robot' },
          { text: 'Live Demo', action: 'live_demo', icon: 'fa-solid fa-video' },
        ],
        { profit: '$299+ daily', efficiency: 20 },
      )
    }
  } else {
    // Home page enhanced responses
    if (lowerMessage.includes('profit') || lowerMessage.includes('earn')) {
      const randomBalance = getRandomBalance()
      const randomProfit = getRandomProfit()
      const randomBots = getRandomBots()
      const randomProjected = getRandomProjected()
      const randomEfficiency = getRandomEfficiency()

      addAIMessage(
        `💰 **AI Profit Analysis Report**<br><br>
        **Current Mining Status:**<br>
        • **Total Balance:** <span class="text-green-400">$${randomBalance}</span><br>
        • **24h Profit:** +$${randomProfit}<br>
        • **Active Bots:** ${randomBots}<br><br>
        **AI Recommendations:**<br>
        • Upgrade to Swing Master (+15% profit)<br>
        • Add Arbitrage Pro bot<br>
        • Reinvest 50% of profits<br><br>
        **Projected Monthly Profit:** $${randomProjected}<br>
        **AI Action:** Optimize mining strategy`,
        [
          { text: 'Upgrade Now', action: 'upgrade_now', icon: 'fa-solid fa-crown' },
          { text: 'View Stats', action: 'view_stats', icon: 'fa-solid fa-chart-simple' },
          { text: 'Auto Mine', action: 'auto_mine', icon: 'fa-solid fa-robot' },
        ],
        { profit: `+$${randomProfit}`, efficiency: randomEfficiency },
      )
    } else if (lowerMessage.includes('upgrade') || lowerMessage.includes('bot')) {
      const currentBotLevel = getCurrentBotLevel()
      const targetBotLevel = getTargetBotLevel()
      const upgradeCost = getUpgradeCost()
      const profitIncrease = getProfitIncrease()
      const roiPeriod = getROIPeriod()
      const gracePeriod = getGracePeriod()

      addAIMessage(
        `⚡ **AI Bot Upgrade Analysis**<br><br>
        **Recommended Upgrade Path:**<br>
        • **Current Level:** ${currentBotLevel}<br>
        • **Target Level:** ${targetBotLevel}<br>
        • **Investment:** $${upgradeCost}<br><br>
        **Expected Benefits:**<br>
        • Daily profit increase: +$${profitIncrease}<br>
        • ROI period: ${roiPeriod} days<br>
        • Grace period: ${gracePeriod} days<br><br>
        **AI Verification:** Highly Recommended ✅<br>
        **Profit Probability:** 92%`,
        [
          { text: 'Upgrade Bot', action: 'upgrade_bot', icon: 'fa-solid fa-bolt' },
          { text: 'View Details', action: 'view_details', icon: 'fa-solid fa-eye' },
          { text: 'AI Strategy', action: 'ai_strategy', icon: 'fa-solid fa-brain' },
        ],
        { profit: `+$${profitIncrease}/day`, efficiency: 35 },
      )
    } else {
      // Default enhanced response for authenticated users
      const randomEfficiency = getRandomEfficiency()

      addAIMessage(
        `🤖 **AI Mining Analysis Complete**<br><br>
        **Analysis of:** "${userMessage}"<br><br>
        **AI Insights Generated:**<br>
        • Mining efficiency: ${randomEfficiency}%<br>
        • Profit optimization opportunities<br>
        • Risk assessment: Low-Medium<br>
        • Suggested bot upgrades<br><br>
        **Recommended Actions:**<br>
        1. Review mining statistics<br>
        2. Consider bot upgrades<br>
        3. Reinvest profits<br>
        4. Monitor daily earnings<br><br>
        **Would you like me to:**`,
        [
          { text: 'Optimize Now', action: 'optimize_now', icon: 'fa-solid fa-play' },
          { text: 'Deep Analysis', action: 'deep_analysis', icon: 'fa-solid fa-microscope' },
          { text: 'AI Strategy', action: 'ai_strategy', icon: 'fa-solid fa-brain' },
        ],
        { profit: '+$45-60/day', efficiency: randomEfficiency },
      )
    }
  }
}

const handleQuickAction = (action: { text: string; action: string; icon: string }) => {
  if (!isAuthenticated.value) {
    switch (action.action) {
      case 'profit_calc':
        addAIMessage(
          `🧮 **AI Profit Calculator**<br><br>
          **Investment:** $1000<br>
          **Bot:** Swing Master ($699)<br>
          **Monthly ROI:** 12-18%<br><br>
          **Projected Earnings:**<br>
          • Month 1: $120-180 profit<br>
          • Month 3: $360-540 profit<br>
          • Month 6: $720-1080 profit<br><br>
          **ROI Period:** 2-3 months<br>
          **Grace Period:** 14 days<br><br>
          **Ready to start mining?**`,
          [
            { text: 'Start Mining', action: 'start_mining', icon: 'fa-solid fa-play' },
            { text: 'View Bots', action: 'view_bots', icon: 'fa-solid fa-list' },
            { text: 'Register', action: 'register_now', icon: 'fa-solid fa-user-plus' },
          ],
          { profit: '$120-180/month', efficiency: 85 },
        )
        break
      default:
        userInput.value = action.text
        sendMessage()
    }
  } else {
    switch (action.action) {
      case 'ai_strategy':
        addAIMessage(
          `🧠 **AI Mining Strategy Generated**<br><br>
          **Strategy:** Compound Mining AI<br>
          **Success Rate:** 88%<br>
          **Risk Level:** Low<br><br>
          **Execution Plan:**<br>
          1. Start with Basic bot<br>
          2. Reinvest 70% of profits<br>
          3. Upgrade after 30 days<br>
          4. Target VIP bot in 90 days<br><br>
          **Expected Results:**<br>
          • Month 1: $299-478 profit<br>
          • Month 3: $2,500-3,500 profit<br>
          • Month 6: $8,000-12,000 profit<br><br>
          **Activate AI strategy?**`,
          [
            { text: 'Activate AI', action: 'activate_ai', icon: 'fa-solid fa-play' },
            { text: 'Customize', action: 'customize', icon: 'fa-solid fa-sliders' },
            { text: 'Backtest', action: 'backtest', icon: 'fa-solid fa-chart-line' },
          ],
          { profit: '$299-478/month', efficiency: 88 },
        )
        break
      default:
        userInput.value = action.text
        sendMessage()
    }
  }
}

const usePrompt = (prompt: string) => {
  userInput.value = prompt
  sendMessage()
}

const attachFile = () => {
  // Implement file attachment
  console.log('File attachment')
}

const clearChat = () => {
  chatHistory.value = []
  showWelcome.value = true

  const welcomeMessage = !isAuthenticated.value
    ? "🧹 **Chat Cleared**<br><br>I'm ready to help you discover Golden Rise mining! What would you like to explore?"
    : '🧹 **Chat Reset Complete**<br><br>AI Mining Assistant ready for new analysis. What mining insights would you like today?'

  const quickActions = !isAuthenticated.value
    ? [
        { text: 'AI Bots', action: 'ai_bots', icon: 'fa-solid fa-robot' },
        { text: 'Quick Start', action: 'quick_start', icon: 'fa-solid fa-bolt' },
        { text: 'Live Demo', action: 'live_demo', icon: 'fa-solid fa-video' },
      ]
    : [
        { text: 'Mining AI', action: 'mining_ai', icon: 'fa-solid fa-chart-line' },
        { text: 'Portfolio AI', action: 'portfolio_ai', icon: 'fa-solid fa-coins' },
        { text: 'Profit AI', action: 'profit_ai', icon: 'fa-solid fa-crown' },
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
  // Simulate AI notifications with mining insights
  setInterval(() => {
    if (!isOpen.value && Math.random() > 0.6) {
      hasNewMessage.value = true
    }
  }, 45000)

  // Simulate processing power fluctuations
  setInterval(() => {
    processingPower.value = 80 + Math.random() * 15
  }, 3000)
})

onUnmounted(() => {
  if (recordingInterval) {
    clearInterval(recordingInterval)
  }
})
</script>

<style scoped>
/* Golden Rise Theme */
:root {
  --golden-primary: #f59e0b;
  --golden-secondary: #d97706;
  --golden-accent: #fbbf24;
  --golden-dark: #1c1c1e;
  --golden-light: #fef3c7;
}

/* Responsive Container */
.ai-agent-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

/* Golden Rise Floating Button */
.ai-floating-btn {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--golden-primary) 0%, var(--golden-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
}

@media (max-width: 640px) {
  .ai-floating-btn {
    width: 56px;
    height: 56px;
    bottom: 16px;
    right: 16px;
  }
}

.ai-floating-btn:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 40px rgba(245, 158, 11, 0.4);
}

.ai-floating-btn.active {
  background: linear-gradient(135deg, var(--golden-accent) 0%, #f59e0b 100%);
}

.ai-floating-btn.pulsing {
  animation: pulse-glow 2s infinite;
}

/* Golden Rise Chat Interface */
.ai-chat-interface {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  max-width: 95vw;
  height: 600px;
  max-height: 80vh;
  background: rgba(28, 28, 30, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 999;
}

@media (max-width: 640px) {
  .ai-chat-interface {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
    bottom: 0;
    right: 0;
    border-radius: 0;
    border: none;
  }

  .ai-agent-container {
    bottom: 16px;
    right: 16px;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .ai-chat-interface {
    width: 420px;
    height: 650px;
    max-height: 85vh;
  }
}

@media (min-width: 1025px) {
  .ai-chat-interface {
    width: 450px;
    height: 700px;
  }
}

/* Header */
.ai-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
}

.ai-agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--golden-primary) 0%, var(--golden-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.ai-agent-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(245, 158, 11, 0.4) 0%, transparent 70%);
  animation: glow-pulse 2s infinite;
}

.ai-header-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-header-btn:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: var(--golden-primary);
  color: var(--golden-accent);
  transform: translateY(-2px);
}

.ai-header-btn.active {
  background: rgba(245, 158, 11, 0.3);
  border-color: var(--golden-primary);
  color: var(--golden-accent);
}

.ai-header-btn.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #ef4444;
}

/* Status Bar */
.ai-status-bar {
  padding: 8px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Welcome Message */
.welcome-message {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  animation: slideIn 0.5s ease;
}

.welcome-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.capability-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #9ca3af;
  padding: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

/* Messages */
.ai-chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 640px) {
  .ai-chat-messages {
    padding: 16px;
  }
}

.message {
  display: flex;
  gap: 12px;
  animation: messageSlide 0.3s ease;
}

.message.user {
  flex-direction: row-reverse;
}

.message.user .message-content {
  background: linear-gradient(135deg, var(--golden-primary) 0%, var(--golden-secondary) 100%);
  border: none;
  align-self: flex-end;
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
  max-width: 75%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px 16px;
  position: relative;
}

.message.ai .message-content {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

@media (max-width: 640px) {
  .message {
    gap: 8px;
  }

  .message-content {
    max-width: 85% !important;
  }
}

.message-text {
  color: white;
  font-size: 14px;
  line-height: 1.5;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  text-align: right;
}

/* Mining Data */
.mining-data {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 12px;
}

.mining-data-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mining-data-item .label {
  color: #9ca3af;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.quick-action-btn {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 10px;
  padding: 6px 12px;
  color: var(--golden-accent);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.quick-action-btn:hover {
  background: rgba(245, 158, 11, 0.3);
  transform: translateY(-2px);
}

/* Quick Access Grid */
.quick-access-grid {
  padding: 0 20px 20px;
}

@media (max-width: 640px) {
  .quick-access-grid {
    padding: 0 16px 16px;
  }

  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

.quick-access-btn {
  background: linear-gradient(
    135deg,
    rgba(var(--gradient-color, 245, 158, 11), 0.1),
    rgba(var(--gradient-color, 217, 119, 6), 0.1)
  );
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  padding: 12px 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
}

.quick-access-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent);
  transition: left 0.5s ease;
}

.quick-access-btn:hover::before {
  left: 100%;
}

.quick-access-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.2);
}

/* Input Area */
.ai-input-area {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(245, 158, 11, 0.2);
}

@media (max-width: 640px) {
  .ai-input-area {
    padding: 16px;
  }
}

.ai-input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.ai-input-wrapper {
  flex: 1;
  position: relative;
}

.ai-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
  padding: 14px 20px 36px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.ai-input:focus {
  outline: none;
  border-color: var(--golden-primary);
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.ai-input-hints {
  position: absolute;
  bottom: 8px;
  left: 20px;
  right: 20px;
}

.hint-text {
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ai-input-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .ai-input-actions {
    gap: 6px;
  }
}

.ai-input-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

@media (max-width: 640px) {
  .ai-input-btn {
    width: 40px;
    height: 40px;
  }
}

.ai-input-btn:hover:not(:disabled) {
  background: rgba(245, 158, 11, 0.2);
  color: var(--golden-accent);
  transform: translateY(-2px);
}

.attach-btn:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: var(--golden-primary);
  color: var(--golden-accent);
}

.ai-input-btn.recording {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: white;
  animation: pulse 1s infinite;
}

.send-btn:not(:disabled) {
  background: linear-gradient(135deg, var(--golden-primary) 0%, var(--golden-secondary) 100%);
  border: none;
  color: white;
}

.send-btn:not(:disabled):hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Voice Visualizer */
.voice-visualizer {
  margin-top: 16px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
}

.visualizer-bars {
  display: flex;
  gap: 3px;
  justify-content: center;
  align-items: end;
  height: 40px;
  margin-bottom: 12px;
}

.visualizer-bar {
  width: 5px;
  background: linear-gradient(to top, #ef4444, #f87171);
  border-radius: 3px;
  animation: visualizer-pulse 0.6s infinite alternate;
}

.voice-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stop-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stop-btn:hover {
  background: #ef4444;
  color: white;
}

/* Suggested Prompts */
.suggested-prompts {
  margin-top: 16px;
}

.prompts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 8px;
}

@media (max-width: 640px) {
  .prompts-grid {
    grid-template-columns: 1fr;
  }
}

.prompt-btn {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--golden-accent);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prompt-btn:hover {
  background: rgba(245, 158, 11, 0.2);
  color: white;
  transform: translateY(-2px);
}

/* Notification Badge */
.ai-notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, var(--golden-primary), #f97316);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  animation: badge-pulse 2s infinite;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Animations */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes badge-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes visualizer-pulse {
  from {
    height: 8px;
  }
  to {
    height: 35px;
  }
}

@keyframes ai-slide-enter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes ai-slide-leave {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
}

.ai-slide-enter-active {
  animation: ai-slide-enter 0.3s ease-out;
}

.ai-slide-leave-active {
  animation: ai-slide-leave 0.2s ease-in;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 13px;
}

.dots {
  display: flex;
  gap: 3px;
}

.dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--golden-primary);
  animation: typing-dot 1.4s infinite;
}

.dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-dot {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
}

/* Avatar Glow Effects */
.ai-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--golden-primary) 0%, var(--golden-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.ai-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(245, 158, 11, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: avatar-glow 2s infinite;
}

@keyframes avatar-glow {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

.ai-pulse-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid rgba(28, 28, 30, 0.98);
  animation: online-pulse 2s infinite;
}

@keyframes online-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
  }
}

/* Scrollbar Styling */
.ai-chat-messages::-webkit-scrollbar {
  width: 6px;
}

.ai-chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.ai-chat-messages::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.3);
  border-radius: 3px;
}

.ai-chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 158, 11, 0.5);
}

/* Accessibility */
@media (prefers-reduced-motion) {
  .ai-floating-btn,
  .quick-access-btn,
  .ai-input-btn,
  .message,
  .typing-indicator span,
  .visualizer-bar,
  .ai-notification-badge,
  .ai-glow,
  .ai-pulse-ring,
  .online-indicator,
  .ai-agent-glow {
    animation: none;
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .ai-chat-interface {
    border: 2px solid var(--golden-primary);
  }

  .ai-input,
  .ai-input-btn,
  .quick-access-btn {
    border: 2px solid var(--golden-primary);
  }

  .message-content {
    border: 2px solid var(--golden-primary);
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .ai-floating-btn {
    width: 64px;
    height: 64px;
  }

  .ai-input-btn,
  .quick-action-btn,
  .ai-header-btn {
    min-height: 44px;
    min-width: 44px;
  }

  .ai-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>

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
            <button @click="toggleTheme" class="ai-header-btn">
              <i class="fa-solid" :class="isDarkTheme ? 'fa-sun' : 'fa-moon'"></i>
            </button>
            <button @click="clearChat" class="ai-header-btn">
              <i class="fa-solid fa-trash"></i>
            </button>
            <button @click="isOpen = false" class="ai-header-btn">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- AI Status Bar -->
        <div class="ai-status-bar">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-300">Processing Power:</span>
            <div class="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                :style="{ width: processingPower + '%' }"
              ></div>
            </div>
            <span class="text-xs text-cyan-400">{{ processingPower }}%</span>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="ai-chat-messages" ref="chatMessages">
          <!-- Welcome Message -->
          <div v-if="showWelcome && chatHistory.length === 0" class="welcome-message">
            <div class="welcome-avatar">
              <i class="fa-solid fa-sparkles text-purple-400"></i>
            </div>
            <div class="welcome-content">
              <div class="welcome-text">
                <h4 class="font-bold text-lg mb-2">Welcome to Wadajir AI</h4>
                <p class="text-sm text-gray-300 mb-3">
                  Your intelligent trading companion powered by advanced 2025 AI technology.
                </p>

                <!-- Capabilities Grid -->
                <div class="capabilities-grid">
                  <div class="capability-item">
                    <i class="fa-solid fa-brain text-cyan-400"></i>
                    <span>Predictive Analysis</span>
                  </div>
                  <div class="capability-item">
                    <i class="fa-solid fa-bolt text-green-400"></i>
                    <span>Real-time Insights</span>
                  </div>
                  <div class="capability-item">
                    <i class="fa-solid fa-shield text-purple-400"></i>
                    <span>Risk Management</span>
                  </div>
                  <div class="capability-item">
                    <i class="fa-solid fa-chart-line text-yellow-400"></i>
                    <span>Portfolio AI</span>
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
                  <i :class="action.icon" class="mr-1"></i>
                  {{ action.text }}
                </button>
              </div>

              <!-- Market Data for Trading Messages -->
              <div v-if="message.marketData" class="market-data">
                <div class="market-data-item">
                  <span class="label">Price:</span>
                  <span class="value text-green-400">{{ message.marketData.price }}</span>
                </div>
                <div class="market-data-item">
                  <span class="label">Change:</span>
                  <span
                    class="value"
                    :class="message.marketData.change >= 0 ? 'text-green-400' : 'text-red-400'"
                  >
                    {{ message.marketData.change >= 0 ? '+' : '' }}{{ message.marketData.change }}%
                  </span>
                </div>
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
                <span>AI is thinking</span>
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
                    ? 'Ask AI about trading strategies, market analysis, or portfolio advice...'
                    : 'Ask about platform features, security, or how to get started...'
                "
                class="ai-input"
                :disabled="isTyping"
              />
              <div class="ai-input-hints">
                <span class="hint-text">Try: "Market analysis" or "Trading tips"</span>
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
    marketData?: { price: string; change: number }
  }>
>([])

// Quick access actions - dynamic based on authentication
const quickAccessActions = computed(() => {
  if (!isAuthenticated.value) {
    return [
      {
        icon: 'fa-solid fa-rocket',
        text: 'Features',
        action: 'platform_features',
        gradient: '#667eea, #764ba2',
      },
      {
        icon: 'fa-solid fa-play',
        text: 'Get Started',
        action: 'how_to_start',
        gradient: '#4facfe, #00f2fe',
      },
      {
        icon: 'fa-solid fa-shield',
        text: 'Security',
        action: 'security_info',
        gradient: '#f093fb, #f5576c',
      },
      {
        icon: 'fa-solid fa-gem',
        text: 'Benefits',
        action: 'platform_benefits',
        gradient: '#fa709a, #fee140',
      },
      {
        icon: 'fa-solid fa-question',
        text: 'Help',
        action: 'help_guide',
        gradient: '#30cfd0, #330867',
      },
      {
        icon: 'fa-solid fa-user-plus',
        text: 'Register',
        action: 'register',
        gradient: '#a8edea, #fed6e3',
      },
    ]
  } else {
    return [
      {
        icon: 'fa-solid fa-chart-line',
        text: 'Market AI',
        action: 'analyze_market',
        gradient: '#667eea, #764ba2',
      },
      {
        icon: 'fa-solid fa-lightbulb',
        text: 'AI Tips',
        action: 'trading_tips',
        gradient: '#4facfe, #00f2fe',
      },
      {
        icon: 'fa-solid fa-shield',
        text: 'Risk AI',
        action: 'security_check',
        gradient: '#f093fb, #f5576c',
      },
      {
        icon: 'fa-solid fa-coins',
        text: 'Portfolio AI',
        action: 'portfolio_advice',
        gradient: '#fa709a, #fee140',
      },
      {
        icon: 'fa-solid fa-bolt',
        text: 'Auto Trade',
        action: 'quick_trade',
        gradient: '#30cfd0, #330867',
      },
      {
        icon: 'fa-solid fa-robot',
        text: 'AI Strategy',
        action: 'ai_strategy',
        gradient: '#a8edea, #fed6e3',
      },
    ]
  }
})

// Suggested prompts
const suggestedPrompts = computed(() => {
  if (!isAuthenticated.value) {
    return [
      'What makes Wadajir different?',
      'How secure is the platform?',
      'How do I start trading?',
      'What are the trading fees?',
    ]
  } else {
    return ['Analyze BTC market', 'Portfolio optimization', 'Risk assessment', 'Trading signals']
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
        ? "🚀 **Welcome to Wadajir AI!** I'm your intelligent trading guide. I can help you:<br><br>• Learn about cryptocurrency trading<br>• Understand platform features<br>• Get step-by-step guidance<br>• Explore security measures<br><br>**What would you like to explore today?**"
        : '🤖 **AI Trading Assistant Online**<br><br>**Real-time Capabilities:**<br>• Market prediction analysis<br>• Portfolio risk assessment<br>• Automated trading signals<br>• Profit optimization strategies<br><br>**How can I enhance your trading today?**'

      const quickActions = !isAuthenticated.value
        ? [
            { text: 'Platform Tour', action: 'platform_tour', icon: 'fa-solid fa-compass' },
            { text: 'Start Guide', action: 'start_guide', icon: 'fa-solid fa-play' },
            { text: 'Security AI', action: 'security_ai', icon: 'fa-solid fa-shield' },
          ]
        : [
            { text: 'Market AI', action: 'market_ai', icon: 'fa-solid fa-chart-line' },
            { text: 'Portfolio AI', action: 'portfolio_ai', icon: 'fa-solid fa-coins' },
            { text: 'Trade AI', action: 'trade_ai', icon: 'fa-solid fa-bolt' },
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
        userInput.value = 'Tell me about Wadajir AI capabilities'
      } else {
        userInput.value = 'Generate market analysis report'
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
  marketData?: { price: string; change: number },
) => {
  chatHistory.value.push({
    type: 'ai',
    text,
    time: currentTime.value,
    quickActions,
    marketData,
  })
  scrollToBottom()
  hasNewMessage.value = true
}

const generateEnhancedAIResponse = (userMessage: string) => {
  const lowerMessage = userMessage.toLowerCase()

  if (!isAuthenticated.value) {
    // Landing page enhanced responses
    if (lowerMessage.includes('ai') || lowerMessage.includes('capabilit')) {
      addAIMessage(
        `🤖 **Wadajir AI Capabilities 2025**<br><br>
        **Advanced AI Features:**<br>
        🔹 **Predictive Analytics** - 85% accuracy rate<br>
        🔹 **Real-time Market Scanning** - 50+ exchanges<br>
        🔹 **Risk Assessment AI** - Automated protection<br>
        🔹 **Portfolio Optimization** - Smart rebalancing<br>
        🔹 **Trading Signal Generation** - AI-powered alerts<br>
        🔹 **Sentiment Analysis** - Social media & news monitoring<br><br>
        **Why choose Wadajir AI?**<br>
        • Lower risk with AI insights<br>
        • Higher profit potential<br>
        • 24/7 automated monitoring<br>
        • Personalized strategies<br><br>
        Ready to experience AI-powered trading?`,
        [
          { text: 'AI Demo', action: 'ai_demo', icon: 'fa-solid fa-play' },
          { text: 'Start Free', action: 'start_free', icon: 'fa-solid fa-rocket' },
          { text: 'Learn More', action: 'learn_more', icon: 'fa-solid fa-graduation-cap' },
        ],
      )
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('platform')) {
      addAIMessage(
        `🌟 **Wadajir Platform Features**<br><br>
        **Trading Excellence:**<br>
        • **Multi-Exchange** - Access 100+ markets<br>
        • **Advanced Charts** - Professional tools<br>
        • **Mobile App** - Trade anywhere<br><br>
        **AI Integration:**<br>
        • **Smart Orders** - AI-optimized execution<br>
        • **Risk Management** - AI protection<br>
        • **Portfolio AI** - Automated optimization<br><br>
        **Security First:**<br>
        • **Bank-Grade Encryption**<br>
        • **Cold Storage** - 98% funds offline<br>
        • **Insurance Coverage**<br><br>
        **Start your journey today!**`,
        [
          { text: 'View Demo', action: 'view_demo', icon: 'fa-solid fa-eye' },
          { text: 'Compare Plans', action: 'compare_plans', icon: 'fa-solid fa-chart-bar' },
          { text: 'Get Started', action: 'get_started', icon: 'fa-solid fa-play-circle' },
        ],
      )
    } else {
      // Default enhanced response
      addAIMessage(
        `💡 **AI Insight Detected**<br><br>
        I've analyzed your query about **"${userMessage}"** and here's what I can provide:<br><br>
        **Immediate Assistance:**<br>
        • Detailed platform walkthrough<br>
        • Step-by-step registration guide<br>
        • Security verification process<br>
        • Funding methods explained<br><br>
        **AI-Powered Insights:**<br>
        • Market entry strategies<br>
        • Risk assessment for beginners<br>
        • Portfolio building basics<br><br>
        **What specific area would you like me to focus on?**`,
        [
          { text: 'Quick Start', action: 'quick_start', icon: 'fa-solid fa-bolt' },
          { text: 'AI Guide', action: 'ai_guide', icon: 'fa-solid fa-robot' },
          { text: 'Live Demo', action: 'live_demo', icon: 'fa-solid fa-video' },
        ],
      )
    }
  } else {
    // Home page enhanced responses
    if (lowerMessage.includes('market') || lowerMessage.includes('analysis')) {
      addAIMessage(
        `📊 **AI Market Analysis Report**<br><br>
        **Current Market Status:**<br>
        • **Overall Trend:** <span class="text-green-400">Bullish 📈</span><br>
        • **Market Sentiment:** 72/100 (Positive)<br>
        • **BTC Dominance:** 42.8%<br><br>
        **AI Predictions:**<br>
        • **BTC:** Expected movement +3-5% in 24h<br>
        • **ETH:** Breaking resistance at $3,200<br>
        • **Top Opportunities:** SOL, AVAX, MATIC<br><br>
        **Risk Level:** <span class="text-yellow-400">Medium</span><br>
        **AI Recommendation:** Consider accumulating during dips`,
        [
          { text: 'Trade Now', action: 'trade_now', icon: 'fa-solid fa-bolt' },
          { text: 'Set Alerts', action: 'set_alerts', icon: 'fa-solid fa-bell' },
          { text: 'Full Report', action: 'full_report', icon: 'fa-solid fa-file-chart-column' },
        ],
        { price: '$43,258.90', change: 2.45 },
      )
    } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('balance')) {
      addAIMessage(
        `💰 **AI Portfolio Analysis**<br><br>
        **Portfolio Performance:**<br>
        • **Total Value:** <strong>$18,742.56</strong><br>
        • **24h Change:** <span class="text-green-400">+3.82%</span><br>
        • **7d Performance:** +12.45%<br><br>
        **AI Recommendations:**<br>
        • Take 25% profit on SOL position<br>
        • Increase BTC allocation by 15%<br>
        • Consider adding DOT for diversification<br><br>
        **Risk Score:** 6.2/10 (Moderate)<br>
        **Profit Potential:** 18-25% next month`,
        [
          { text: 'Rebalance', action: 'rebalance', icon: 'fa-solid fa-scale-balanced' },
          { text: 'Optimize', action: 'optimize', icon: 'fa-solid fa-chart-line' },
          { text: 'Auto Trade', action: 'auto_trade', icon: 'fa-solid fa-robot' },
        ],
      )
    } else {
      // Default enhanced response for authenticated users
      addAIMessage(
        `🤖 **AI Processing Complete**<br><br>
        **Analysis of:** "${userMessage}"<br><br>
        **AI Insights Generated:**<br>
        • Market correlation analysis<br>
        • Risk assessment matrix<br>
        • Profit probability: 78%<br>
        • Suggested entry points<br><br>
        **Recommended Actions:**<br>
        1. Review detailed technical analysis<br>
        2. Set automated trading parameters<br>
        3. Monitor key support/resistance levels<br><br>
        **Would you like me to:**`,
        [
          { text: 'Execute Trade', action: 'execute_trade', icon: 'fa-solid fa-play' },
          { text: 'Deep Analysis', action: 'deep_analysis', icon: 'fa-solid fa-microscope' },
          { text: 'AI Strategy', action: 'ai_strategy', icon: 'fa-solid fa-brain' },
        ],
      )
    }
  }
}

const handleQuickAction = (action: { text: string; action: string; icon: string }) => {
  if (!isAuthenticated.value) {
    switch (action.action) {
      case 'ai_demo':
        addAIMessage(
          `🎬 **AI Trading Demo**<br><br>
          **Live AI Demonstration:**<br>
          • Real-time market prediction<br>
          • Portfolio optimization simulation<br>
          • Risk assessment demo<br>
          • Automated trading preview<br><br>
          **Experience features:**<br>
          1. AI-powered chart analysis<br>
          2. Smart order execution<br>
          3. Risk management tools<br>
          4. Portfolio optimization<br><br>
          **Ready to start the demo?**`,
          [
            { text: 'Start Demo', action: 'start_demo', icon: 'fa-solid fa-play' },
            { text: 'View Features', action: 'view_features', icon: 'fa-solid fa-list' },
            { text: 'Register', action: 'register_now', icon: 'fa-solid fa-user-plus' },
          ],
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
          `🧠 **AI Trading Strategy Generated**<br><br>
          **Strategy:** Momentum Reversal AI<br>
          **Success Rate:** 82%<br>
          **Risk Level:** Medium<br><br>
          **Execution Plan:**<br>
          1. Identify oversold conditions<br>
          2. Enter on RSI < 30 reversal<br>
          3. Target: 5-8% profit<br>
          4. Stop-loss: 2% below entry<br><br>
          **Current Opportunities:**<br>
          • AVAX showing reversal signals<br>
          • SOL approaching support<br><br>
          **Activate AI strategy?**`,
          [
            { text: 'Activate AI', action: 'activate_ai', icon: 'fa-solid fa-play' },
            { text: 'Customize', action: 'customize', icon: 'fa-solid fa-sliders' },
            { text: 'Backtest', action: 'backtest', icon: 'fa-solid fa-chart-line' },
          ],
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
    ? "🧹 **Chat Cleared**<br><br>I'm ready to help you discover Wadajir and start your trading journey! What would you like to explore?"
    : '🧹 **Chat Reset Complete**<br><br>AI Trading Assistant ready for new analysis. What market insights would you like today?'

  const quickActions = !isAuthenticated.value
    ? [
        { text: 'AI Features', action: 'ai_features', icon: 'fa-solid fa-robot' },
        { text: 'Quick Start', action: 'quick_start', icon: 'fa-solid fa-bolt' },
        { text: 'Live Demo', action: 'live_demo', icon: 'fa-solid fa-video' },
      ]
    : [
        { text: 'Market AI', action: 'market_ai', icon: 'fa-solid fa-chart-line' },
        { text: 'Portfolio AI', action: 'portfolio_ai', icon: 'fa-solid fa-coins' },
        { text: 'Risk AI', action: 'risk_ai', icon: 'fa-solid fa-shield' },
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
  // Simulate AI notifications with market insights
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
/* Responsive Container */
.ai-agent-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

/* Responsive Floating Button */
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
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
}

.ai-floating-btn.active {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.ai-floating-btn.pulsing {
  animation: pulse-glow 2s infinite;
}

/* Enhanced Chat Interface - Responsive */
.ai-chat-interface {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  max-width: 95vw;
  height: 600px;
  max-height: 80vh;
  background: rgba(17, 17, 31, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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

/* Status Bar */
.ai-status-bar {
  padding: 8px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Welcome Message */
.welcome-message {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  animation: slideIn 0.5s ease;
}

.welcome-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
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

/* Enhanced Messages */
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  align-self: flex-end;
}

@media (max-width: 640px) {
  .message {
    gap: 8px;
  }

  .message-content {
    max-width: 85% !important;
  }
}

.market-data {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 12px;
}

.market-data-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.market-data-item .label {
  color: #9ca3af;
}

/* Quick Access Grid - Responsive */
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
    rgba(var(--gradient-color, 102, 126, 234), 0.1),
    rgba(var(--gradient-color, 118, 75, 162), 0.1)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.quick-access-btn:hover::before {
  left: 100%;
}

.quick-access-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Enhanced Input Area */
.ai-input-area {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 14px 20px 36px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.ai-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
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
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.attach-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  color: #3b82f6;
}

.ai-input-btn.recording {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: white;
  animation: pulse 1s infinite;
}

.send-btn:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.send-btn:not(:disabled):hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Enhanced Voice Visualizer */
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 12px;
  color: #9ca3af;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prompt-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(-2px);
}

/* Notification Badge */
.ai-notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ef4444, #f97316);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  animation: badge-pulse 2s infinite;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Enhanced Animations */
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

/* Keep all previous animations from the original CSS */
/* ... existing animations ... */

/* Dark/Light Theme Support */
@media (prefers-color-scheme: light) {
  .ai-chat-interface {
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .ai-input,
  .ai-input-btn,
  .quick-access-btn,
  .prompt-btn {
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: #333;
  }

  .message-text {
    color: #333;
  }

  .hint-text {
    color: #666;
  }
}

/* Accessibility */
@media (prefers-reduced-motion) {
  .ai-floating-btn,
  .quick-access-btn,
  .ai-input-btn,
  .message,
  .typing-indicator span,
  .visualizer-bar,
  .ai-notification-badge {
    animation: none;
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .ai-chat-interface {
    border: 2px solid #fff;
  }

  .ai-input,
  .ai-input-btn,
  .quick-access-btn {
    border: 2px solid #fff;
  }
}
</style>

<template>
  <div class="app-container">
    <!-- Background -->
    <div class="background-gradient"></div>

    <!-- Header with Username -->
    <header class="header">
      <div class="logo-section">
        <div class="logo">W</div>
        <div class="user-display">
          <div class="welcome-text">Welcome back,</div>
          <div class="username">{{ username }}</div>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-details">
            <div class="user-name">{{ username }}</div>
            <div class="user-tier">{{ userTier }}</div>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </header>

    <!-- Zero Balance Banner -->
    <div v-if="!hasDeposited" class="deposit-banner">
      <div class="deposit-content">
        <div class="deposit-icon">
          <i class="fas fa-wallet"></i>
        </div>
        <div class="deposit-info">
          <h3>Account Ready for Funding</h3>
          <p>
            Your current balance is <strong>$0.00</strong>. Make your first deposit to activate
            trading.
          </p>
        </div>
        <button class="deposit-action-btn" @click="handleDeposit">
          <i class="fas fa-plus-circle"></i> Deposit Now
        </button>
      </div>
    </div>

    <!-- Main Banner with Data Mining Background -->
    <div class="banner-section">
      <div class="banner-background"></div>
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <div class="live-indicator">
          <div class="live-dot"></div>
          <span>MARKET LIVE</span>
          <div class="server-status">
            <i class="fas fa-server"></i>
            <span>AI Models: {{ hasDeposited ? 'Active' : 'Ready' }}</span>
          </div>
        </div>
        <h1 class="banner-title">Future is <span class="rainbow-text">NOW</span></h1>
        <p class="banner-subtitle">
          Advanced data mining algorithms powering your trading decisions
        </p>
        <div class="banner-stats">
          <div class="stat">
            <div class="stat-number">99.9%</div>
            <div class="stat-label">Accuracy</div>
          </div>
          <div class="stat">
            <div class="stat-number">0.2s</div>
            <div class="stat-label">Execution</div>
          </div>
          <div class="stat">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Monitoring</div>
          </div>
          <div class="stat">
            <div class="stat-number">$4.2M</div>
            <div class="stat-label">Volume Today</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Summary -->
    <div class="dashboard-summary">
      <div class="summary-card">
        <div class="summary-icon" style="background: linear-gradient(135deg, #00e676, #00c853)">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ totalBalance }}</div>
          <div class="summary-label">Total Balance</div>
        </div>
        <div class="summary-trend" :class="balanceTrend">
          {{ hasDeposited ? '+2.4%' : '0%' }}
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="background: linear-gradient(135deg, #ff6b6b, #ee5a52)">
          <i class="fas fa-robot"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ activeBots }}</div>
          <div class="summary-label">Active Bots</div>
        </div>
        <div class="summary-trend positive">+{{ activeBots }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ hasDeposited ? '99.97%' : '--' }}</div>
          <div class="summary-label">Success Rate</div>
        </div>
        <div class="summary-trend neutral">+0.1%</div>
      </div>
    </div>

    <!-- Partners Section -->
    <div class="partners-section">
      <h3 class="section-title">Trusted Partners</h3>
      <div class="partners-container">
        <div class="partners-track">
          <div class="partner-logo">BINANCE</div>
          <div class="partner-logo">COINBASE</div>
          <div class="partner-logo">KRAKEN</div>
          <div class="partner-logo">BYBIT</div>
          <div class="partner-logo">OKX</div>
          <div class="partner-logo">BITGET</div>
          <div class="partner-logo">FTX</div>
          <div class="partner-logo">HUOBI</div>
          <!-- Duplicate for seamless loop -->
          <div class="partner-logo">BINANCE</div>
          <div class="partner-logo">COINBASE</div>
          <div class="partner-logo">KRAKEN</div>
          <div class="partner-logo">BYBIT</div>
          <div class="partner-logo">OKX</div>
          <div class="partner-logo">BITGET</div>
          <div class="partner-logo">FTX</div>
          <div class="partner-logo">HUOBI</div>
        </div>
      </div>
    </div>

    <!-- News Ticker -->
    <div class="news-ticker">
      <div class="ticker-header">
        <i class="fas fa-bullhorn"></i>
        <span>LIVE UPDATES</span>
      </div>
      <div class="ticker-content">
        🚀 BTC breaks $92,000 resistance • 💎 ETH 2.0 staking reaches new highs • ⚡ AI algorithms
        detected 15 profitable patterns • 🌟 WADAJIR AI achieves 99.9% accuracy this week • 🔒
        Security audit passed successfully • 📈 Market sentiment: BULLISH • 🤖 24/7 trading bots
        active • 💰 New arbitrage opportunities detected
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="actions-grid">
      <div
        class="action-card"
        v-for="action in quickActions"
        :key="action.name"
        @click="handleAction(action.name)"
        :class="{ disabled: !hasDeposited && action.locked }"
      >
        <div class="action-icon" :style="{ background: action.color }">
          <i :class="action.icon"></i>
        </div>
        <span class="action-label">{{ action.name }}</span>
        <div v-if="!hasDeposited && action.locked" class="action-lock">
          <i class="fas fa-lock"></i>
        </div>
      </div>
    </div>

    <!-- Crypto Stats -->
    <div class="crypto-stats">
      <div
        class="crypto-card"
        v-for="coin in cryptoData"
        :key="coin.symbol"
        @click="selectCoin(coin)"
      >
        <div class="crypto-header">
          <div class="crypto-icon" :style="{ color: coin.color }">
            <i :class="coin.icon"></i>
          </div>
          <div class="crypto-info">
            <h3>{{ coin.symbol }}/USDT</h3>
            <div class="crypto-volume">Vol: {{ coin.volume }}</div>
          </div>
        </div>
        <p class="price" :class="{ 'price-up': coin.change >= 0, 'price-down': coin.change < 0 }">
          {{ coin.price }}
        </p>
        <p
          class="change"
          :class="{ 'change-up': coin.change >= 0, 'change-down': coin.change < 0 }"
        >
          {{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%
        </p>
        <div class="crypto-chart">
          <div class="chart-line" :style="{ height: coin.chartHeight + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Trading Bots Section -->
    <div class="trading-bots-section">
      <div class="section-header">
        <h3 class="section-title">AI Trading Bots</h3>
        <p class="section-subtitle">Upgrade your trading with automated AI algorithms</p>
      </div>

      <div class="bots-container">
        <div
          class="bot-card"
          v-for="bot in tradingBots"
          :key="bot.id"
          :class="{ disabled: !hasDeposited }"
        >
          <div class="bot-header" :style="{ background: bot.gradient }">
            <div class="bot-icon">
              <i :class="bot.icon"></i>
            </div>
            <div class="bot-name">{{ bot.name }}</div>
            <div class="bot-level">{{ bot.level }}</div>
          </div>

          <div class="bot-content">
            <div class="bot-price">
              <span class="price">{{ bot.price }}</span>
              <span class="period">one-time payment</span>
            </div>

            <div class="bot-roi">
              <div class="roi-label">Monthly ROI</div>
              <div class="roi-value">{{ bot.roi }}</div>
              <div class="roi-period">{{ bot.roiPeriod }}</div>
            </div>

            <div class="bot-features">
              <div class="feature" v-for="feature in bot.features" :key="feature">
                <i class="fas fa-check"></i>
                <span>{{ feature }}</span>
              </div>
            </div>

            <div class="bot-grace">
              <i class="fas fa-clock"></i>
              <span>Grace Period: {{ bot.gracePeriod }}</span>
            </div>

            <button
              class="upgrade-bot-btn"
              @click="upgradeBot(bot)"
              :disabled="
                !hasDeposited ||
                bot.upgraded ||
                parseFloat(totalBalance.replace('$', '')) < bot.priceValue
              "
            >
              {{ bot.upgraded ? '✓ Active' : hasDeposited ? 'Upgrade Now' : 'Deposit Required' }}
            </button>

            <div v-if="bot.popular" class="popular-tag">
              <i class="fas fa-star"></i> MOST POPULAR
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Features -->
    <div class="ai-features">
      <h3 class="section-title">AI-Powered Features</h3>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-brain"></i>
          </div>
          <h4>Predictive Analytics</h4>
          <p>Advanced ML models predict market movements</p>
          <div class="feature-status" :class="{ active: hasDeposited, inactive: !hasDeposited }">
            <i class="fas fa-circle"></i> {{ hasDeposited ? 'Active' : 'Available' }}
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-chart-network"></i>
          </div>
          <h4>Data Mining</h4>
          <p>Real-time analysis of market patterns</p>
          <div class="feature-status" :class="{ active: hasDeposited, inactive: !hasDeposited }">
            <i class="fas fa-circle"></i> {{ hasDeposited ? 'Active' : 'Available' }}
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-robot"></i>
          </div>
          <h4>Auto Trading</h4>
          <p>AI-driven automated trading strategies</p>
          <div class="feature-status" :class="{ active: hasDeposited, inactive: !hasDeposited }">
            <i class="fas fa-circle"></i> {{ hasDeposited ? 'Active' : 'Available' }}
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h4>Risk Management</h4>
          <p>Smart risk assessment and protection</p>
          <div class="feature-status" :class="{ active: hasDeposited, inactive: !hasDeposited }">
            <i class="fas fa-circle"></i> {{ hasDeposited ? 'Active' : 'Available' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="transactions-section">
      <div class="section-header">
        <h3 class="section-title">Recent Transactions</h3>
        <button class="view-all-btn" @click="viewAllTransactions">
          View All <i class="fas fa-arrow-right"></i>
        </button>
      </div>
      <div class="transactions-list">
        <div class="transaction-item" v-for="tx in recentTransactions" :key="tx.id">
          <div class="transaction-icon" :style="{ background: tx.color }">
            <i :class="tx.icon"></i>
          </div>
          <div class="transaction-details">
            <div class="transaction-type">{{ tx.type }}</div>
            <div class="transaction-asset">{{ tx.asset }}</div>
            <div class="transaction-time">{{ tx.time }}</div>
          </div>
          <div
            class="transaction-amount"
            :class="{ positive: tx.amount > 0, negative: tx.amount < 0 }"
          >
            {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }}{{ tx.currency }}
          </div>
          <div class="transaction-status" :class="tx.status">
            {{ tx.status }}
          </div>
        </div>
      </div>
    </div>

    <!-- Market Table -->
    <div class="market-section">
      <div class="market-header">
        <h2 class="section-title">USDT Market</h2>
        <div class="market-filters">
          <button class="filter-btn active">All</button>
          <button class="filter-btn">Gainers</button>
          <button class="filter-btn">Volume</button>
          <button class="view-all-btn" @click="viewAllMarkets">
            View All <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div class="market-table">
        <div class="table-header">
          <span>ASSET</span>
          <span>PRICE</span>
          <span>24H CHANGE</span>
          <span>24H VOLUME</span>
          <span>ACTION</span>
        </div>

        <div
          class="table-row"
          v-for="coin in marketData"
          :key="coin.symbol"
          @click="selectCoin(coin)"
        >
          <div class="asset-cell">
            <div class="coin-icon" :style="{ color: coin.color }">
              <i :class="coin.icon"></i>
            </div>
            <div class="coin-info">
              <span class="coin-symbol">{{ coin.symbol }}</span>
              <span class="coin-name">{{ coin.name }}</span>
            </div>
          </div>
          <span
            class="price"
            :class="{ 'price-up': coin.change >= 0, 'price-down': coin.change < 0 }"
          >
            {{ coin.price }}
          </span>
          <span
            class="change"
            :class="{ 'change-up': coin.change >= 0, 'change-down': coin.change < 0 }"
          >
            {{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%
          </span>
          <span class="volume">{{ coin.volume }}</span>
          <button class="trade-btn" @click.stop="openTradeModal(coin)" :disabled="!hasDeposited">
            Trade
          </button>
        </div>
      </div>
    </div>

    <!-- Trading Pairs -->
    <div class="trading-pairs">
      <h3 class="section-title">Popular Trading Pairs</h3>
      <div class="pairs-grid">
        <div
          class="pair-card"
          v-for="pair in tradingPairs"
          :key="pair.name"
          @click="selectPair(pair)"
        >
          <div class="pair-info">
            <div class="pair-name">{{ pair.name }}</div>
            <div class="pair-price">{{ pair.price }}</div>
          </div>
          <div
            class="pair-change"
            :class="{ positive: pair.change > 0, negative: pair.change < 0 }"
          >
            {{ pair.change > 0 ? '+' : '' }}{{ pair.change }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <footer class="bottom-nav">
      <div
        class="nav-item"
        v-for="nav in navigation"
        :key="nav.id"
        :class="{ active: activeTab === nav.id }"
        @click="navigateTo(nav.id)"
      >
        <i :class="nav.icon"></i>
        <span>{{ nav.label }}</span>
      </div>
    </footer>

    <!-- Deposit Modal -->
    <div v-if="showDepositModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content deposit-modal" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-wallet"></i> Deposit Funds</h3>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="deposit-amount">
            <label>Enter Amount (USD)</label>
            <div class="amount-input">
              <span class="currency-symbol">$</span>
              <input type="number" v-model="depositAmount" placeholder="0.00" min="50" step="1" />
            </div>
            <div class="amount-presets">
              <button
                v-for="preset in [50, 100, 500, 1000, 5000]"
                :key="preset"
                @click="depositAmount = preset"
                :class="{ active: depositAmount == preset }"
                class="preset-btn"
              >
                ${{ preset }}
              </button>
            </div>
          </div>

          <div class="deposit-methods">
            <h4>Select Payment Method</h4>
            <div class="methods-grid">
              <div
                class="method-card"
                v-for="method in depositMethods"
                :key="method.id"
                :class="{ selected: selectedMethod === method.id }"
                @click="selectedMethod = method.id"
              >
                <div class="method-icon">
                  <i :class="method.icon"></i>
                </div>
                <div class="method-name">{{ method.name }}</div>
                <div class="method-fee">{{ method.fee }}</div>
                <div class="method-check" v-if="selectedMethod === method.id">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="deposit-summary">
            <div class="summary-row">
              <span>Deposit Amount</span>
              <span class="amount">${{ depositAmount || '0.00' }}</span>
            </div>
            <div class="summary-row">
              <span>Processing Fee</span>
              <span class="fee">${{ (depositAmount * 0.02).toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total to Pay</span>
              <span class="total-amount">${{ ((depositAmount || 0) * 1.02).toFixed(2) }}</span>
            </div>
          </div>

          <button
            class="btn-primary confirm-deposit-btn"
            @click="confirmDeposit"
            :disabled="!depositAmount || depositAmount < 50 || !selectedMethod"
          >
            <i class="fas fa-lock"></i> Confirm Deposit
          </button>

          <div class="deposit-note">
            <i class="fas fa-info-circle"></i>
            <p>Minimum deposit: $50. Funds will be available immediately.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Modal -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirm Logout</h3>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to logout from WADAJIR Premium Trading?</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="closeModal">Cancel</button>
            <button class="btn-primary" @click="confirmLogout">Yes, Logout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import the CSS file
import './HomeView.css'

export default {
  name: 'PremiumHome',
  data() {
    return {
      username: 'Trader',
      activeTab: 'home',
      showLogoutModal: false,
      showDepositModal: false,
      hasDeposited: false,
      totalBalance: '$0.00',
      balanceTrend: 'neutral',
      userTier: 'Basic',
      activeBots: 0,
      depositAmount: '',
      selectedMethod: 'crypto',

      quickActions: [
        {
          name: 'Deposit',
          icon: 'fas fa-wallet',
          color: 'linear-gradient(135deg, #667eea, #764ba2)',
          locked: false,
        },
        {
          name: 'Withdraw',
          icon: 'fas fa-money-bill-wave',
          color: 'linear-gradient(135deg, #f093fb, #f5576c)',
          locked: true,
        },
        {
          name: 'Transfer',
          icon: 'fas fa-exchange-alt',
          color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          locked: true,
        },
        {
          name: 'Upgrade',
          icon: 'fas fa-crown',
          color: 'linear-gradient(135deg, #43e97b, #38f9d7)',
          locked: true,
        },
      ],

      tradingBots: [
        {
          id: 1,
          name: 'SCALPER PRO',
          level: 'BASIC',
          icon: 'fas fa-bolt',
          gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
          price: '$299',
          priceValue: 299,
          roi: '5-8%',
          roiPeriod: 'guaranteed monthly',
          gracePeriod: '7 days',
          features: ['5-10 trades daily', 'Low risk strategy', 'Basic analytics', 'Email alerts'],
          upgraded: false,
          popular: false,
        },
        {
          id: 2,
          name: 'SWING MASTER',
          level: 'PRO',
          icon: 'fas fa-chart-line',
          gradient: 'linear-gradient(135deg, #00e676, #00c853)',
          price: '$699',
          priceValue: 699,
          roi: '12-18%',
          roiPeriod: 'average monthly',
          gracePeriod: '14 days',
          features: [
            'Medium-term trades',
            'Advanced analytics',
            'Risk management',
            'SMS + Email alerts',
          ],
          upgraded: false,
          popular: true,
        },
        {
          id: 3,
          name: 'ARBITRAGE PRO',
          level: 'EXPERT',
          icon: 'fas fa-random',
          gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
          price: '$1,299',
          priceValue: 1299,
          roi: '20-30%',
          roiPeriod: 'estimated monthly',
          gracePeriod: '30 days',
          features: [
            'Multi-exchange',
            'Real-time arbitrage',
            'Advanced controls',
            'Priority support',
          ],
          upgraded: false,
          popular: false,
        },
        {
          id: 4,
          name: 'AI MASTER',
          level: 'VIP',
          icon: 'fas fa-brain',
          gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
          price: '$2,999',
          priceValue: 2999,
          roi: '35-50%',
          roiPeriod: 'projected monthly',
          gracePeriod: '60 days',
          features: [
            'Machine Learning',
            'Predictive analytics',
            'Highest returns',
            'VIP concierge',
          ],
          upgraded: false,
          popular: false,
        },
      ],

      depositMethods: [
        {
          id: 'crypto',
          name: 'Cryptocurrency',
          icon: 'fab fa-bitcoin',
          fee: '1% fee',
        },
        {
          id: 'bank',
          name: 'Bank Transfer',
          icon: 'fas fa-university',
          fee: '2% fee',
        },
        {
          id: 'card',
          name: 'Credit/Debit Card',
          icon: 'fas fa-credit-card',
          fee: '3% fee',
        },
      ],

      cryptoData: [
        {
          symbol: 'BTC',
          price: '$91,681',
          change: 0.8,
          icon: 'fab fa-bitcoin',
          color: '#F59E0B',
          volume: '42.5B',
          chartHeight: 85,
        },
        {
          symbol: 'ETH',
          price: '$3,042',
          change: 1.06,
          icon: 'fab fa-ethereum',
          color: '#8B5CF6',
          volume: '18.2B',
          chartHeight: 75,
        },
        {
          symbol: 'SOL',
          price: '$145.20',
          change: 2.45,
          icon: 'fas fa-bolt',
          color: '#7C3AED',
          volume: '8.7B',
          chartHeight: 92,
        },
      ],

      marketData: [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: '$91,681',
          change: 0.8,
          icon: 'fab fa-bitcoin',
          color: '#F59E0B',
          volume: '$42.5B',
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: '$3,042',
          change: 1.06,
          icon: 'fab fa-ethereum',
          color: '#8B5CF6',
          volume: '$18.2B',
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          price: '$145.20',
          change: 2.45,
          icon: 'fas fa-bolt',
          color: '#7C3AED',
          volume: '$8.7B',
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          price: '$0.4521',
          change: -0.5,
          icon: 'fas fa-layer-group',
          color: '#3B82F6',
          volume: '$1.2B',
        },
      ],

      recentTransactions: [],

      tradingPairs: [
        { name: 'BTC/ETH', price: '30.12', change: 0.8 },
        { name: 'ETH/SOL', price: '20.95', change: 1.2 },
        { name: 'BTC/SOL', price: '631.5', change: -0.3 },
        { name: 'ADA/DOT', price: '0.066', change: 2.1 },
      ],

      navigation: [
        { id: 'home', label: 'Home', icon: 'fas fa-home' },
        { id: 'trade', label: 'Trade', icon: 'fas fa-chart-line' },
        { id: 'wallet', label: 'Wallet', icon: 'fas fa-wallet' },
        { id: 'account', label: 'Account', icon: 'fas fa-user' },
      ],
    }
  },

  mounted() {
    this.loadUserData()
  },

  methods: {
    loadUserData() {
      // Get registered user data from localStorage
      const registeredUser = localStorage.getItem('registeredUser')
      if (registeredUser) {
        try {
          const user = JSON.parse(registeredUser)
          this.username = user.name || user.username || user.email || 'Trader'

          // Check for existing balance data
          const userBalance = localStorage.getItem('userBalance')
          if (userBalance) {
            const data = JSON.parse(userBalance)
            this.hasDeposited = data.hasDeposited || false
            this.totalBalance = `$${parseFloat(data.balance || 0).toFixed(2)}`
            this.userTier = data.tier || 'Basic'
            this.activeBots = data.activeBots || 0

            // Update bot status
            if (data.upgradedBots) {
              this.tradingBots.forEach((bot) => {
                if (data.upgradedBots.includes(bot.id)) {
                  bot.upgraded = true
                }
              })
            }

            // Unlock actions if deposited
            if (this.hasDeposited) {
              this.quickActions.forEach((action) => (action.locked = false))
            }
          }
        } catch (e) {
          console.error('Error loading user data:', e)
        }
      }
    },

    handleDeposit() {
      this.showDepositModal = true
    },

    confirmDeposit() {
      if (!this.depositAmount || this.depositAmount < 50) {
        alert('Minimum deposit amount is $50')
        return
      }

      // Calculate deposit with fee
      const amount = parseFloat(this.depositAmount)
      const fee = amount * 0.02
      const totalReceived = amount - fee

      // Update user state
      this.totalBalance = `$${totalReceived.toFixed(2)}`
      this.hasDeposited = true
      this.balanceTrend = 'positive'
      this.userTier = 'Premium'

      // Unlock actions
      this.quickActions.forEach((action) => (action.locked = false))

      // Add transaction
      this.recentTransactions.unshift({
        id: Date.now(),
        type: 'DEPOSIT',
        asset: 'USD',
        time: 'Just now',
        amount: totalReceived,
        currency: 'USD',
        status: 'completed',
        color: 'linear-gradient(135deg, #667eea, #764ba2)',
        icon: 'fas fa-wallet',
      })

      // Save to localStorage
      const userData = {
        name: this.username,
        hasDeposited: true,
        balance: totalReceived,
        tier: 'Premium',
        activeBots: this.activeBots,
        upgradedBots: this.tradingBots.filter((b) => b.upgraded).map((b) => b.id),
      }
      localStorage.setItem('userBalance', JSON.stringify(userData))

      // Show success
      alert(
        `✅ Deposit successful!\n\nAmount: $${amount.toFixed(2)}\nFee: $${fee.toFixed(2)}\nAvailable: $${totalReceived.toFixed(2)}`,
      )

      // Close modal
      this.closeModal()
    },

    upgradeBot(bot) {
      if (!this.hasDeposited) {
        this.handleDeposit()
        return
      }

      const balance = parseFloat(this.totalBalance.replace('$', '').replace(',', ''))

      if (balance < bot.priceValue) {
        alert(
          `Insufficient balance. You need ${bot.price} to upgrade. Current balance: ${this.totalBalance}`,
        )
        return
      }

      if (
        !confirm(
          `Upgrade to ${bot.name} for ${bot.price}?\n\nMonthly ROI: ${bot.roi}\nGrace Period: ${bot.gracePeriod}`,
        )
      ) {
        return
      }

      // Process upgrade
      const newBalance = balance - bot.priceValue
      this.totalBalance = `$${newBalance.toFixed(2)}`
      bot.upgraded = true
      this.activeBots++

      // Add transaction
      this.recentTransactions.unshift({
        id: Date.now(),
        type: 'UPGRADE',
        asset: bot.name,
        time: 'Just now',
        amount: -bot.priceValue,
        currency: 'USD',
        status: 'completed',
        color: bot.gradient,
        icon: bot.icon,
      })

      // Save data
      const userData = JSON.parse(localStorage.getItem('userBalance') || '{}')
      userData.balance = newBalance
      userData.activeBots = this.activeBots
      userData.upgradedBots = this.tradingBots.filter((b) => b.upgraded).map((b) => b.id)
      localStorage.setItem('userBalance', JSON.stringify(userData))

      alert(`✅ Successfully upgraded to ${bot.name}!\n\nYour AI bot is now active and trading.`)
    },

    handleAction(action) {
      if (!this.hasDeposited && action !== 'Deposit') {
        alert('Deposit funds first to unlock this feature.')
        this.handleDeposit()
        return
      }

      switch (action) {
        case 'Deposit':
          this.handleDeposit()
          break
        case 'Withdraw':
          alert('Withdrawal feature coming soon!')
          break
        case 'Transfer':
          // Navigate to transfer page
          break
        case 'Upgrade':
          // Scroll to bots section
          const botsSection = document.querySelector('.trading-bots-section')
          if (botsSection) {
            botsSection.scrollIntoView({ behavior: 'smooth' })
          }
          break
      }
    },

    navigateTo(tabId) {
      this.activeTab = tabId
    },

    handleLogout() {
      this.showLogoutModal = true
    },

    confirmLogout() {
      localStorage.removeItem('authToken')
      sessionStorage.clear()
      this.showLogoutModal = false

      setTimeout(() => {
        if (this.$router) {
          this.$router.push('/landingview')
        } else {
          window.location.href = '/landingview'
        }
      }, 300)
    },

    closeModal() {
      this.showLogoutModal = false
      this.showDepositModal = false
      this.depositAmount = ''
      this.selectedMethod = 'crypto'
    },

    selectCoin(coin) {
      console.log('Selected:', coin)
    },

    openTradeModal(coin) {
      if (!this.hasDeposited) {
        alert('Please deposit funds first to start trading.')
        this.handleDeposit()
        return
      }
      // Navigate to trade
    },

    viewAllTransactions() {},
    viewAllMarkets() {},
    selectPair(pair) {},
  },
}
</script>

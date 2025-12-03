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
            <div class="user-tier">VIP Tier 3</div>
          </div>
        </div>
        <button class="logout-btn" @click="showLogoutModal = true">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </header>

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
            <span>AI Models: Active</span>
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
          <div class="summary-value">$124,568.42</div>
          <div class="summary-label">Total Balance</div>
        </div>
        <div class="summary-trend positive">+2.4%</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="background: linear-gradient(135deg, #ff6b6b, #ee5a52)">
          <i class="fas fa-coins"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">$42,156.78</div>
          <div class="summary-label">24h Profit</div>
        </div>
        <div class="summary-trend positive">+1.8%</div>
      </div>
      <div class="summary-card">
        <div class="summary-icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">99.97%</div>
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
      >
        <div class="action-icon" :style="{ background: action.color }">
          <i :class="action.icon"></i>
        </div>
        <span class="action-label">{{ action.name }}</span>
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
          <div class="feature-status active"><i class="fas fa-circle"></i> Active</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-chart-network"></i>
          </div>
          <h4>Data Mining</h4>
          <p>Real-time analysis of market patterns</p>
          <div class="feature-status active"><i class="fas fa-circle"></i> Active</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-robot"></i>
          </div>
          <h4>Auto Trading</h4>
          <p>AI-driven automated trading strategies</p>
          <div class="feature-status active"><i class="fas fa-circle"></i> Active</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h4>Risk Management</h4>
          <p>Smart risk assessment and protection</p>
          <div class="feature-status active"><i class="fas fa-circle"></i> Active</div>
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
          <button class="trade-btn" @click.stop="openTradeModal(coin)">Trade</button>
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
export default {
  name: 'PremiumHome',
  data() {
    return {
      username: 'Premium Trader', // Default username
      activeTab: 'home',
      showLogoutModal: false,
      quickActions: [
        {
          name: 'Deposit',
          icon: 'fas fa-wallet',
          color: 'linear-gradient(135deg, #667eea, #764ba2)',
        },
        {
          name: 'Withdraw',
          icon: 'fas fa-money-bill-wave',
          color: 'linear-gradient(135deg, #f093fb, #f5576c)',
        },
        {
          name: 'Transfer',
          icon: 'fas fa-exchange-alt',
          color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        },
        {
          name: 'Upgrade',
          icon: 'fas fa-crown',
          color: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        },
        {
          name: 'Buy',
          icon: 'fas fa-arrow-up',
          color: 'linear-gradient(135deg, #fa709a, #fee140)',
        },
        {
          name: 'Sell',
          icon: 'fas fa-arrow-down',
          color: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
        },
        { name: 'Swap', icon: 'fas fa-sync', color: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
        { name: 'Earn', icon: 'fas fa-coins', color: 'linear-gradient(135deg, #ffd89b, #19547b)' },
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
        {
          symbol: 'DOT',
          name: 'Polkadot',
          price: '$6.78',
          change: 1.2,
          icon: 'fas fa-circle',
          color: '#E6007A',
          volume: '$0.8B',
        },
        {
          symbol: 'AVAX',
          name: 'Avalanche',
          price: '$34.21',
          change: 3.1,
          icon: 'fas fa-mountain',
          color: '#E84142',
          volume: '$1.5B',
        },
      ],
      recentTransactions: [
        {
          id: 1,
          type: 'BUY',
          asset: 'BTC/USDT',
          time: '10:23 AM',
          amount: 0.5,
          currency: 'BTC',
          status: 'completed',
          color: 'linear-gradient(135deg, #00e676, #00c853)',
          icon: 'fas fa-arrow-down',
        },
        {
          id: 2,
          type: 'SELL',
          asset: 'ETH/USDT',
          time: '09:15 AM',
          amount: -2.4,
          currency: 'ETH',
          status: 'completed',
          color: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
          icon: 'fas fa-arrow-up',
        },
        {
          id: 3,
          type: 'DEPOSIT',
          asset: 'USDT',
          time: 'Yesterday',
          amount: 5000,
          currency: 'USDT',
          status: 'completed',
          color: 'linear-gradient(135deg, #667eea, #764ba2)',
          icon: 'fas fa-wallet',
        },
      ],
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
    // Get username from localStorage or use default
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsedData = JSON.parse(userData)
        this.username = parsedData.name || parsedData.username || 'Premium Trader'
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  },
  methods: {
    navigateTo(tabId) {
      this.activeTab = tabId

      // Handle navigation to different pages
      switch (tabId) {
        case 'trade':
          // Navigate to trade page using path instead of name
          if (this.$router) {
            this.$router.push('/trade')
          } else {
            window.location.href = '/trade'
          }
          break
        case 'wallet':
          // Navigate to transfer page using path instead of name
          if (this.$router) {
            this.$router.push('/transfer')
          } else {
            window.location.href = '/transfer'
          }
          break
        case 'account':
          // Navigate to account page
          if (this.$router) {
            this.$router.push('/membership')
          } else {
            window.location.href = '/membership'
          }
          break
        default:
          // For home, just update active state (stay on current page)
          this.activeTab = 'home'
      }
    },
    handleLogout() {
      this.showLogoutModal = true
    },
    confirmLogout() {
      // Clear user session/token
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      sessionStorage.clear()

      // Close modal first
      this.showLogoutModal = false

      // Redirect to login page
      setTimeout(() => {
        if (this.$router) {
          this.$router.push('/login')
        } else {
          window.location.href = '/login'
        }
      }, 300)
    },
    closeModal() {
      this.showLogoutModal = false
    },
    handleAction(action) {
      console.log('Action:', action)

      // Handle quick actions
      switch (action) {
        case 'Deposit':
          alert('Deposit functionality coming soon!')
          break
        case 'Withdraw':
          alert('Withdraw functionality coming soon!')
          break
        case 'Transfer':
          this.navigateTo('wallet')
          break
        case 'Upgrade':
          alert('Upgrade functionality coming soon!')
          break
        default:
          alert(`Action: ${action}`)
      }
    },
    selectCoin(coin) {
      console.log('Selected:', coin)
    },
    selectPair(pair) {
      console.log('Selected pair:', pair)
    },
    viewAllTransactions() {
      console.log('View all transactions')
    },
    viewAllMarkets() {
      console.log('View all markets')
    },
    openTradeModal(coin) {
      // Navigate to trade page
      this.navigateTo('trade')
    },
  },
}
</script>

<style scoped>
/* Base Styles - FIXED SCROLLING */
.app-container {
  min-height: 100vh;
  background: #0a0f2d;
  color: white;
  font-family: 'Arial', sans-serif;
  position: relative;
  padding-bottom: 80px; /* Space for bottom nav */
  overflow-x: hidden;
  height: 100vh; /* Fixed: Set height to viewport height */
  overflow-y: auto; /* Fixed: Enable vertical scrolling */
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #0a0f2d, #1a1f3d, #2a2f4d);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  z-index: -2;
}

@keyframes gradientShift {
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

/* Updated Header with Username */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.user-display {
  display: flex;
  flex-direction: column;
}

.welcome-text {
  font-size: 10px;
  opacity: 0.7;
  margin-bottom: 2px;
}

.username {
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(45deg, #00e676, #00bcd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 12px;
  font-weight: 600;
}

.user-tier {
  font-size: 10px;
  opacity: 0.7;
  color: #00e676;
}

.logout-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
}

/* Banner Section */
.banner-section {
  position: relative;
  padding: 30px 20px;
  margin: 15px;
  border-radius: 20px;
  overflow: hidden;
  min-height: 250px;
  display: flex;
  align-items: center;
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  animation: dataFlow 20s linear infinite;
  background-size: 200px 200px;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(102, 126, 234, 0.3) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.banner-content {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
}

.live-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 600;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #00e676;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

@keyframes dataFlow {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200px 200px;
  }
}

.server-status {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 230, 118, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  color: #00e676;
}

.banner-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rainbow-text {
  background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rainbow 3s ease infinite;
}

@keyframes rainbow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.banner-subtitle {
  opacity: 0.9;
  font-size: 14px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
}

.banner-stats {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(45deg, #00ff88, #0088ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  opacity: 0.8;
}

/* Dashboard Summary */
.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 15px;
  margin-top: 15px;
}

.summary-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

.summary-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.summary-content {
  flex: 1;
}

.summary-value {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 10px;
  opacity: 0.7;
}

.summary-trend {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 6px;
}

.summary-trend.positive {
  background: rgba(0, 230, 118, 0.1);
  color: #00e676;
}

.summary-trend.neutral {
  background: rgba(255, 255, 255, 0.1);
  color: #9ca3af;
}

/* Partners Section */
.partners-section {
  padding: 0 15px;
  margin-top: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: white;
}

.partners-container {
  overflow: hidden;
  position: relative;
}

.partners-track {
  display: flex;
  animation: scrollPartners 30s linear infinite;
  gap: 12px;
}

@keyframes scrollPartners {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.partner-logo {
  flex-shrink: 0;
  width: 90px;
  height: 35px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

/* News Ticker */
.news-ticker {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 15px;
  overflow: hidden;
  display: flex;
}

.ticker-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.ticker-content {
  white-space: nowrap;
  animation: ticker 25s linear infinite;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  padding: 10px 15px;
  flex: 1;
}

@keyframes ticker {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 0 15px;
  margin-top: 15px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.action-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  font-size: 14px;
}

.action-label {
  font-size: 9px;
  font-weight: 500;
  text-align: center;
}

/* Crypto Stats */
.crypto-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 0 15px;
  margin-top: 15px;
}

.crypto-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.crypto-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

.crypto-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.crypto-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.crypto-info h3 {
  font-size: 13px;
  margin: 0;
}

.crypto-volume {
  font-size: 9px;
  opacity: 0.7;
  margin-top: 2px;
}

.price {
  font-size: 14px;
  font-weight: bold;
  margin: 4px 0;
}

.change {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 6px;
  display: inline-block;
}

.price-up,
.change-up {
  color: #00e676;
}
.change-up {
  background: rgba(0, 230, 118, 0.1);
}
.price-down,
.change-down {
  color: #ff1744;
}
.change-down {
  background: rgba(255, 23, 68, 0.1);
}

.crypto-chart {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: flex-end;
}

.chart-line {
  width: 3px;
  background: linear-gradient(to top, #00e676, #0088ff);
  margin: 0 2px;
  border-radius: 2px;
}

/* AI Features */
.ai-features {
  padding: 0 15px;
  margin-top: 30px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 15px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 20px;
}

.feature-card h4 {
  font-size: 14px;
  margin-bottom: 6px;
  color: white;
}

.feature-card p {
  font-size: 11px;
  opacity: 0.8;
  line-height: 1.3;
  margin-bottom: 8px;
}

.feature-status {
  margin-top: 8px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #00e676;
}

.feature-status.active i {
  color: #00e676;
  font-size: 7px;
}

/* Transactions Section */
.transactions-section {
  padding: 0 15px;
  margin-top: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.view-all-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 9px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.transactions-list {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  gap: 10px;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.transaction-details {
  flex: 1;
}

.transaction-type {
  font-size: 11px;
  font-weight: 600;
}

.transaction-asset {
  font-size: 10px;
  opacity: 0.8;
  margin-top: 2px;
}

.transaction-time {
  font-size: 9px;
  opacity: 0.6;
  margin-top: 2px;
}

.transaction-amount {
  font-size: 12px;
  font-weight: bold;
}

.transaction-amount.positive {
  color: #00e676;
}
.transaction-amount.negative {
  color: #ff6b6b;
}

.transaction-status {
  font-size: 9px;
  padding: 3px 6px;
  border-radius: 6px;
  text-transform: uppercase;
}

.transaction-status.completed {
  background: rgba(0, 230, 118, 0.1);
  color: #00e676;
}

/* Market Section */
.market-section {
  padding: 0 15px;
  margin-top: 25px;
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.market-filters {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 9px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.market-table {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 9px;
  font-weight: 600;
  opacity: 0.7;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 10px 12px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.table-row:last-child {
  border-bottom: none;
}

.asset-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.coin-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.coin-symbol {
  font-weight: 600;
  font-size: 11px;
}

.coin-name {
  font-size: 9px;
  opacity: 0.7;
}

.trade-btn {
  background: linear-gradient(135deg, #00e676, #00c853);
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.trade-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 10px rgba(0, 230, 118, 0.3);
}

.volume {
  font-size: 11px;
  opacity: 0.8;
}

/* Trading Pairs */
.trading-pairs {
  padding: 0 15px;
  margin-top: 25px;
  margin-bottom: 80px; /* Reduced margin for better scrolling */
}

.pairs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.pair-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pair-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.pair-info {
  margin-bottom: 6px;
}

.pair-name {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 4px;
}

.pair-price {
  font-size: 13px;
  font-weight: bold;
}

.pair-change {
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 6px;
  display: inline-block;
}

.pair-change.positive {
  background: rgba(0, 230, 118, 0.1);
  color: #00e676;
}

.pair-change.negative {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 10px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.6);
  font-size: 9px;
}

.nav-item.active {
  color: #00e676;
  background: rgba(0, 230, 118, 0.1);
}

.nav-item i {
  font-size: 14px;
}

.nav-item.active i {
  text-shadow: 0 0 10px rgba(0, 230, 118, 0.5);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #1a1f3d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin-bottom: 20px;
  opacity: 0.8;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-secondary {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  border: none;
  color: white;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-summary {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .crypto-stats {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .pairs-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .market-filters {
    flex-wrap: wrap;
  }

  .table-header,
  .table-row {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }

  .volume {
    display: none;
  }
}

@media (max-width: 480px) {
  .header {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .actions-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .banner-title {
    font-size: 24px;
  }

  .banner-stats {
    flex-wrap: wrap;
    gap: 12px;
  }

  .trading-pairs {
    margin-bottom: 90px;
  }
}
</style>

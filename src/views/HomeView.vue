<template>
  <div class="app-container">
    <!-- Background -->
    <div class="background-gradient"></div>

    <!-- Header -->
    <header class="header">
      <div class="logo-section">
        <div class="logo">W</div>
        <div class="brand">
          <div class="brand-name">WADAJIR</div>
          <div class="brand-tagline">Premium Trading</div>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </header>

    <!-- Main Banner with Data Mining Background -->
    <div class="banner-section">
      <div class="banner-background"></div>
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <div class="live-indicator">
          <div class="live-dot"></div>
          <span>MARKET LIVE</span>
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
        </div>
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
          <!-- Duplicate for seamless loop -->
          <div class="partner-logo">BINANCE</div>
          <div class="partner-logo">COINBASE</div>
          <div class="partner-logo">KRAKEN</div>
          <div class="partner-logo">BYBIT</div>
          <div class="partner-logo">OKX</div>
          <div class="partner-logo">BITGET</div>
        </div>
      </div>
    </div>

    <!-- News Ticker -->
    <div class="news-ticker">
      <div class="ticker-content">
        🚀 AI-Powered Trading Live • 💎 Real-time Data Mining Active • ⚡ Machine Learning Models
        Running • 🌟 Predictive Analytics Enabled • 🔒 Blockchain Security Active •
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
        <h3>{{ coin.symbol }}/USDT</h3>
        <p class="price" :class="{ 'price-up': coin.change >= 0, 'price-down': coin.change < 0 }">
          {{ coin.price }}
        </p>
        <p
          class="change"
          :class="{ 'change-up': coin.change >= 0, 'change-down': coin.change < 0 }"
        >
          {{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%
        </p>
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
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-chart-network"></i>
          </div>
          <h4>Data Mining</h4>
          <p>Real-time analysis of market patterns</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-robot"></i>
          </div>
          <h4>Auto Trading</h4>
          <p>AI-driven automated trading strategies</p>
        </div>
      </div>
    </div>

    <!-- Market Table -->
    <div class="market-section">
      <div class="market-header">
        <h2 class="section-title">USDT Market</h2>
        <button class="view-all-btn">View All <i class="fas fa-arrow-right"></i></button>
      </div>

      <div class="market-table">
        <div class="table-header">
          <span>ASSET</span>
          <span>PRICE</span>
          <span>24H CHANGE</span>
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
          <button class="trade-btn">Trade</button>
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
        @click="setActiveTab(nav.id)"
      >
        <i :class="nav.icon"></i>
        <span>{{ nav.label }}</span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PremiumHome',
  data() {
    return {
      activeTab: 'home',
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
        { symbol: 'BTC', price: '$91,681', change: 0.8, icon: 'fab fa-bitcoin', color: '#F59E0B' },
        { symbol: 'ETH', price: '$3,042', change: 1.06, icon: 'fab fa-ethereum', color: '#8B5CF6' },
        { symbol: 'SOL', price: '$145.20', change: 2.45, icon: 'fas fa-bolt', color: '#7C3AED' },
      ],
      marketData: [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: '$91,681',
          change: 0.8,
          icon: 'fab fa-bitcoin',
          color: '#F59E0B',
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: '$3,042',
          change: 1.06,
          icon: 'fab fa-ethereum',
          color: '#8B5CF6',
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          price: '$145.20',
          change: 2.45,
          icon: 'fas fa-bolt',
          color: '#7C3AED',
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          price: '$0.4521',
          change: -0.5,
          icon: 'fas fa-layer-group',
          color: '#3B82F6',
        },
      ],
      navigation: [
        { id: 'home', label: 'Home', icon: 'fas fa-home' },
        { id: 'trade', label: 'Trade', icon: 'fas fa-chart-line' },
        { id: 'wallet', label: 'Wallet', icon: 'fas fa-wallet' },
        { id: 'account', label: 'Account', icon: 'fas fa-user' },
      ],
    }
  },
  methods: {
    handleLogout() {
      // Emit event to parent component to handle logout and redirect to login
      this.$emit('logout')
    },
    handleAction(action) {
      console.log('Action:', action)
    },
    selectCoin(coin) {
      console.log('Selected:', coin)
    },
    setActiveTab(tabId) {
      this.activeTab = tabId
    },
  },
}
</script>

<style scoped>
/* Base Styles */
.app-container {
  min-height: 100vh;
  background: #0a0f2d;
  color: white;
  font-family: 'Arial', sans-serif;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 80px;
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

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 100;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.brand-name {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(45deg, #00ff88, #0088ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  font-size: 10px;
  opacity: 0.7;
  color: #9ca3af;
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

/* Enhanced Banner Section with Data Mining Background */
.banner-section {
  position: relative;
  padding: 50px 20px 40px;
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  align-items: center;
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(45deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3)),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern><pattern id="data" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="rgba(0,230,118,0.3)"/><circle cx="10" cy="6" r="0.8" fill="rgba(59,130,246,0.3)"/><circle cx="15" cy="15" r="1.2" fill="rgba(168,85,247,0.3)"/><circle cx="5" cy="18" r="0.6" fill="rgba(239,68,68,0.3)"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/><rect width="100" height="100" fill="url(%23data)"/></svg>');
  background-size:
    cover,
    200px 200px;
  animation: dataFlow 20s linear infinite;
}

@keyframes dataFlow {
  0% {
    background-position:
      0% 0%,
      0 0;
  }
  100% {
    background-position:
      100% 100%,
      200px 200px;
  }
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
  margin-bottom: 20px;
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

.banner-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
  background: linear-gradient(45deg, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
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
  font-size: 16px;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
}

.banner-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(45deg, #00ff88, #0088ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

/* AI Features Section */
.ai-features {
  padding: 0 20px;
  margin-top: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 24px;
}

.feature-card h4 {
  font-size: 16px;
  margin-bottom: 8px;
  color: white;
}

.feature-card p {
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.4;
}

/* Partners Section */
.partners-section {
  padding: 0 20px;
  margin-top: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: white;
}

.partners-container {
  overflow: hidden;
  position: relative;
}

.partners-track {
  display: flex;
  animation: scrollPartners 30s linear infinite;
  gap: 15px;
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
  width: 100px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

/* News Ticker */
.news-ticker {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 20px;
  padding: 12px;
  overflow: hidden;
}

.ticker-content {
  white-space: nowrap;
  animation: ticker 20s linear infinite;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
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
  gap: 12px;
  padding: 0 20px;
  margin-top: 20px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 16px;
}

.action-label {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
}

/* Crypto Stats */
.crypto-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 20px;
  margin-top: 20px;
}

.crypto-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.crypto-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

.crypto-card h3 {
  font-size: 12px;
  margin-bottom: 8px;
  opacity: 0.8;
}

.price {
  font-size: 16px;
  font-weight: bold;
  margin: 4px 0;
}

.change {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
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

/* Market Section */
.market-section {
  padding: 0 20px;
  margin-top: 30px;
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.view-all-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.market-table {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 10px;
  font-weight: 600;
  opacity: 0.7;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 16px;
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
  gap: 8px;
}

.coin-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.coin-symbol {
  font-weight: 600;
  font-size: 12px;
}

.coin-name {
  font-size: 10px;
  opacity: 0.7;
}

.trade-btn {
  background: linear-gradient(135deg, #00e676, #00c853);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.trade-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 10px rgba(0, 230, 118, 0.3);
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
  padding: 12px 0;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
}

.nav-item.active {
  color: #00e676;
  background: rgba(0, 230, 118, 0.1);
}

.nav-item i {
  font-size: 16px;
}

.nav-item.active i {
  text-shadow: 0 0 10px rgba(0, 230, 118, 0.5);
}
</style>

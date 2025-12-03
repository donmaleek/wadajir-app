<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0a0f24] via-[#121830] to-[#1a1f3d] text-white pb-24"
  >
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-br from-[#0a0f24] via-[#121830] to-[#1a1f3d]"
      ></div>
      <!-- Floating particles -->
      <div class="absolute inset-0 opacity-20">
        <div
          v-for="n in 30"
          :key="n"
          class="absolute w-1 h-1 bg-white rounded-full"
          :style="{
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
          }"
        ></div>
      </div>
      <!-- Gradient orbs -->
      <div
        class="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"
      ></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 pt-6 px-4">
      <div class="flex items-center justify-between mb-6">
        <button
          @click="$router.push({ name: 'Home' })"
          class="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm"
        >
          <i class="fas fa-arrow-left text-lg"></i>
        </button>

        <div class="text-center">
          <h1
            class="text-2xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            Investment Dashboard
          </h1>
          <p class="text-sm opacity-70 mt-1">Smart Investing • High Returns</p>
        </div>

        <div class="flex items-center space-x-3">
          <button @click="showNotifications" class="p-2 relative">
            <i class="fas fa-bell text-xl"></i>
            <div
              v-if="unreadNotifications"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            ></div>
          </button>
          <button @click="showSettings" class="p-2">
            <i class="fas fa-cog text-xl"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Portfolio Overview -->
    <div class="relative z-10 px-4 mb-6">
      <div
        class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30 shadow-2xl overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full -translate-y-20 translate-x-20"
        ></div>

        <div class="relative z-10">
          <div class="flex items-center justify-between mb-6">
            <div>
              <div class="text-sm opacity-80">Total Investment Value</div>
              <div
                class="text-4xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
              >
                $8,245,680.47
              </div>
              <div class="text-sm opacity-70">USDT</div>
            </div>
            <div class="text-right">
              <div class="text-sm opacity-80">Today's Gain</div>
              <div class="text-2xl font-bold text-green-400">+$42,156.78</div>
              <div class="text-xs text-green-400">+2.4%</div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="bg-black/30 rounded-xl p-3 text-center">
              <div class="text-xs opacity-70 mb-1">Available</div>
              <div class="text-lg font-bold text-green-400">$1,245,680</div>
            </div>
            <div class="bg-black/30 rounded-xl p-3 text-center">
              <div class="text-xs opacity-70 mb-1">Invested</div>
              <div class="text-lg font-bold text-cyan-400">$7,000,000</div>
            </div>
            <div class="bg-black/30 rounded-xl p-3 text-center">
              <div class="text-xs opacity-70 mb-1">Earnings</div>
              <div class="text-lg font-bold text-purple-400">$245,680</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="relative z-10 px-4 mb-6">
      <div class="grid grid-cols-2 gap-4">
        <div
          class="bg-gradient-to-br from-green-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-4 border border-green-500/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-80">Success Rate</div>
              <div class="text-2xl font-bold text-green-400">99.8%</div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="fas fa-chart-line text-green-400"></i>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-80">Avg. Return</div>
              <div class="text-2xl font-bold text-purple-400">1.2%</div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="fas fa-coins text-purple-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Investments -->
    <div class="relative z-10 px-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">Active Investments</h2>
        <button @click="showAllInvestments" class="text-sm text-cyan-400 hover:text-cyan-300">
          View All <i class="fas fa-arrow-right ml-1"></i>
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="investment in activeInvestments"
          :key="investment.id"
          class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
          @click="viewInvestmentDetails(investment)"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :style="{ background: investment.color }"
              >
                <i :class="investment.icon" class="text-lg"></i>
              </div>
              <div>
                <div class="font-bold">{{ investment.name }}</div>
                <div class="text-xs opacity-70">
                  {{ investment.term }} days • {{ investment.risk }} risk
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-green-400">{{ investment.apr }}%</div>
              <div class="text-xs opacity-70">APR</div>
            </div>
          </div>

          <div class="mb-3">
            <div class="flex items-center justify-between text-sm mb-1">
              <div class="opacity-70">Progress</div>
              <div class="font-semibold">{{ investment.progress }}%</div>
            </div>
            <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                :style="{
                  background: investment.progressColor,
                  width: investment.progress + '%',
                }"
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <div>
              <div class="opacity-70">Invested</div>
              <div class="font-bold">${{ formatNumber(investment.amount) }}</div>
            </div>
            <div class="text-right">
              <div class="opacity-70">Earnings</div>
              <div class="font-bold text-green-400">+${{ formatNumber(investment.earnings) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Investment Opportunities -->
    <div class="relative z-10 px-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">Featured Opportunities</h2>
        <div class="flex items-center space-x-2">
          <button @click="scrollCarousel(-1)" class="p-2 rounded-lg bg-white/5 hover:bg-white/10">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button @click="scrollCarousel(1)" class="p-2 rounded-lg bg-white/5 hover:bg-white/10">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div
        ref="opportunitiesCarousel"
        class="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x snap-mandatory"
        style="scroll-behavior: smooth"
      >
        <div
          v-for="opportunity in investmentOpportunities"
          :key="opportunity.id"
          class="flex-shrink-0 w-80 snap-center"
        >
          <InvestmentOpportunityCard
            :opportunity="opportunity"
            @invest="openInvestModal(opportunity)"
          />
        </div>
      </div>
    </div>

    <!-- Performance Chart -->
    <div class="relative z-10 px-4 mb-6">
      <div
        class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">Performance Overview</h3>
          <div class="flex items-center space-x-2">
            <button
              v-for="period in ['7D', '1M', '3M', '1Y']"
              :key="period"
              @click="selectedPeriod = period"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10',
              ]"
            >
              {{ period }}
            </button>
          </div>
        </div>

        <div class="h-48 flex items-end space-x-2 mb-4">
          <div v-for="(bar, index) in performanceData" :key="index" class="flex-1 relative group">
            <div
              class="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90"
              :style="{
                height: bar.value + '%',
                background:
                  bar.value >= 0
                    ? 'linear-gradient(to top, #00e676, #00bcd4)'
                    : 'linear-gradient(to top, #ff6b6b, #ff5252)',
              }"
            ></div>
            <div
              class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-70 whitespace-nowrap"
            >
              {{ bar.label }}
            </div>
            <div
              class="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              {{ bar.value >= 0 ? '+' : '' }}{{ bar.value }}%
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-sm opacity-70">Total Return</div>
            <div class="text-xl font-bold text-green-400">+42.5%</div>
          </div>
          <div class="text-center">
            <div class="text-sm opacity-70">Best Day</div>
            <div class="text-xl font-bold text-cyan-400">+5.2%</div>
          </div>
          <div class="text-center">
            <div class="text-sm opacity-70">Win Rate</div>
            <div class="text-xl font-bold text-purple-400">86%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Investment Calculator -->
    <div class="relative z-10 px-4 mb-6">
      <div
        class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
      >
        <h3 class="text-lg font-bold mb-4">Investment Calculator</h3>

        <div class="space-y-4">
          <div>
            <label class="text-sm opacity-70 mb-2 block">Investment Amount (USDT)</label>
            <div class="relative">
              <input
                v-model="calculatorAmount"
                type="number"
                min="5000"
                step="1000"
                class="w-full pl-12 pr-4 py-3 bg-black/40 border border-cyan-500/30 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
              />
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                <i class="fas fa-coins"></i>
              </div>
              <div class="absolute right-4 top-1/2 transform -translate-y-1/2">USDT</div>
            </div>
            <div class="flex justify-between text-xs opacity-70 mt-1">
              <span>Min: $5,000</span>
              <span>Max: $2,000,000</span>
            </div>
          </div>

          <div>
            <label class="text-sm opacity-70 mb-2 block">Investment Term</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="term in [7, 14, 30, 60, 90, 180]"
                :key="term"
                @click="calculatorTerm = term"
                :class="[
                  'py-2 rounded-lg transition-all',
                  calculatorTerm === term
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/5 hover:bg-white/10',
                ]"
              >
                {{ term }} days
              </button>
            </div>
          </div>

          <!-- Results -->
          <div class="bg-black/30 rounded-xl p-4 mt-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="opacity-70">Daily Earnings</span>
                <span class="font-bold text-green-400">+${{ calculateDailyEarnings() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">Total Earnings</span>
                <span class="font-bold text-cyan-400">+${{ calculateTotalEarnings() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">Final Amount</span>
                <span class="font-bold text-purple-400">${{ calculateFinalAmount() }}</span>
              </div>
            </div>
          </div>

          <button
            @click="investNow"
            class="w-full py-3 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 rounded-xl font-bold text-lg mt-4 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
          >
            Invest Now
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="relative z-10 px-4 mb-6">
      <div
        class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">Recent Activity</h3>
          <button @click="showAllActivity" class="text-sm text-cyan-400 hover:text-cyan-300">
            See All <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            @click="viewActivityDetails(activity)"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :style="{
                  background:
                    activity.type === 'investment'
                      ? 'rgba(0, 230, 118, 0.1)'
                      : activity.type === 'withdrawal'
                        ? 'rgba(255, 107, 107, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                }"
              >
                <i
                  :class="activity.icon"
                  :style="{
                    color:
                      activity.type === 'investment'
                        ? '#00e676'
                        : activity.type === 'withdrawal'
                          ? '#ff6b6b'
                          : '#3b82f6',
                  }"
                ></i>
              </div>
              <div>
                <div class="font-medium">{{ activity.description }}</div>
                <div class="text-xs opacity-70">{{ activity.time }}</div>
              </div>
            </div>
            <div class="text-right">
              <div
                class="font-bold"
                :class="{
                  'text-green-400': activity.amount > 0,
                  'text-red-400': activity.amount < 0,
                  'text-cyan-400': activity.amount === 0,
                }"
              >
                {{ activity.amount > 0 ? '+' : '' }}{{ activity.amount }} USDT
              </div>
              <div class="text-xs opacity-70">{{ activity.status }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div
      class="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#0a0f24] to-transparent"
    >
      <div
        class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
      >
        <div class="grid grid-cols-5 gap-1 p-2">
          <button
            @click="$router.push({ name: 'Home' })"
            class="flex flex-col items-center p-3 rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
          >
            <i class="fas fa-home text-xl mb-1"></i>
            <span class="text-xs font-medium">Home</span>
          </button>

          <button
            @click="$router.push({ name: 'Invest' })"
            class="flex flex-col items-center p-3 rounded-xl transition-all duration-300 bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-300"
          >
            <i class="fas fa-chart-line text-xl mb-1"></i>
            <span class="text-xs font-medium">Invest</span>
          </button>

          <button
            @click="$router.push({ name: 'Trade' })"
            class="flex flex-col items-center p-3 rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
          >
            <i class="fas fa-exchange-alt text-xl mb-1"></i>
            <span class="text-xs font-medium">Trade</span>
          </button>

          <button
            @click="$router.push({ name: 'Transfer' })"
            class="flex flex-col items-center p-3 rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
          >
            <i class="fas fa-wallet text-xl mb-1"></i>
            <span class="text-xs font-medium">Wallet</span>
          </button>

          <button
            @click="$router.push({ name: 'Membership' })"
            class="flex flex-col items-center p-3 rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
          >
            <i class="fas fa-crown text-xl mb-1"></i>
            <span class="text-xs font-medium">VIP</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Investment Modal -->
    <div
      v-if="showInvestmentModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        class="bg-gradient-to-br from-gray-900 to-black rounded-2xl w-full max-w-md border border-cyan-500/30 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">Confirm Investment</h3>
            <button @click="showInvestmentModal = false" class="p-2 hover:bg-white/10 rounded-lg">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div class="text-sm opacity-70">Amount</div>
              <div class="text-xl font-bold text-green-400">${{ calculatorAmount }} USDT</div>
            </div>

            <div class="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div class="text-sm opacity-70">Term</div>
              <div class="text-lg font-bold">{{ calculatorTerm }} Days</div>
            </div>

            <div class="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div class="text-sm opacity-70">APR</div>
              <div class="text-lg font-bold text-cyan-400">{{ calculateAPR() }}%</div>
            </div>

            <div
              class="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl border border-green-500/30"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="text-sm opacity-70">Estimated Return</div>
                <div class="text-xl font-bold text-purple-400">${{ calculateTotalEarnings() }}</div>
              </div>
              <div class="text-xs opacity-70">
                Total: ${{ calculateFinalAmount() }} after {{ calculatorTerm }} days
              </div>
            </div>
          </div>

          <div class="mt-6 flex space-x-3">
            <button
              @click="showInvestmentModal = false"
              class="flex-1 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmInvestment"
              class="flex-1 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Confirm & Invest
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div class="text-center max-w-sm">
        <div
          class="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-green-500/30"
        >
          <!-- Confetti -->
          <div class="absolute inset-0 overflow-hidden">
            <div
              v-for="n in 20"
              :key="n"
              class="absolute w-2 h-2 rounded-full"
              :style="{
                background: ['#00e676', '#00bcd4', '#2196f3', '#9c27b0', '#ff9800'][
                  Math.floor(Math.random() * 5)
                ],
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animation: `confetti-fall ${Math.random() * 2 + 1}s ease-in forwards`,
              }"
            ></div>
          </div>

          <div class="relative">
            <div
              class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center animate-bounce"
            >
              <i class="fas fa-chart-line text-4xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">Investment Started!</h3>
            <p class="opacity-80 mb-6">Your investment of ${{ calculatorAmount }} is now active</p>

            <div class="space-y-3 mb-6">
              <div class="flex items-center justify-between">
                <span class="opacity-70">Term</span>
                <span class="font-bold">{{ calculatorTerm }} days</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">Daily Yield</span>
                <span class="font-bold text-green-400">1.00%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">Maturity Date</span>
                <span class="font-bold text-cyan-400">{{ calculateMaturityDate() }}</span>
              </div>
            </div>

            <button
              @click="showSuccessModal = false"
              class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold"
            >
              Track Investment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Refs
const opportunitiesCarousel = ref(null)
const calculatorAmount = ref(5000)
const calculatorTerm = ref(7)
const selectedPeriod = ref('7D')
const showInvestmentModal = ref(false)
const showSuccessModal = ref(false)
const unreadNotifications = ref(3)

// Data
const activeInvestments = ref([
  {
    id: 1,
    name: 'Premium Yield',
    term: 7,
    risk: 'Low',
    apr: 7.0,
    progress: 57,
    amount: 250000,
    earnings: 7500,
    color: 'linear-gradient(135deg, #00e676, #00c853)',
    progressColor: 'linear-gradient(to right, #00e676, #00bcd4)',
    icon: 'fas fa-chart-line',
  },
  {
    id: 2,
    name: 'High Growth',
    term: 30,
    risk: 'Medium',
    apr: 12.5,
    progress: 23,
    amount: 500000,
    earnings: 28750,
    color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    progressColor: 'linear-gradient(to right, #8b5cf6, #ec4899)',
    icon: 'fas fa-rocket',
  },
  {
    id: 3,
    name: 'VIP Exclusive',
    term: 90,
    risk: 'High',
    apr: 18.0,
    progress: 67,
    amount: 1000000,
    earnings: 120000,
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    progressColor: 'linear-gradient(to right, #f59e0b, #ef4444)',
    icon: 'fas fa-crown',
  },
])

const investmentOpportunities = ref([
  {
    id: 1,
    name: 'Stable Returns',
    apr: 7.0,
    term: 7,
    minAmount: 5000,
    risk: 'Low',
    color: 'from-green-500 to-cyan-500',
    features: ['Daily payout', 'Auto-renewal', 'VIP access'],
  },
  {
    id: 2,
    name: 'Growth Plus',
    apr: 12.5,
    term: 30,
    minAmount: 25000,
    risk: 'Medium',
    color: 'from-purple-500 to-pink-500',
    features: ['Weekly payout', 'Bonus rewards', 'Priority support'],
  },
  {
    id: 3,
    name: 'Elite Fund',
    apr: 18.0,
    term: 90,
    minAmount: 100000,
    risk: 'High',
    color: 'from-yellow-500 to-red-500',
    features: ['Monthly payout', 'Personal manager', 'Exclusive offers'],
  },
])

const performanceData = ref([
  { label: 'Mon', value: 1.2 },
  { label: 'Tue', value: 2.4 },
  { label: 'Wed', value: -0.8 },
  { label: 'Thu', value: 3.1 },
  { label: 'Fri', value: 2.1 },
  { label: 'Sat', value: 1.5 },
  { label: 'Sun', value: 0.9 },
])

const recentActivity = ref([
  {
    id: 1,
    type: 'investment',
    amount: 25000,
    description: 'New Investment: Premium Yield',
    time: '2 hours ago',
    status: 'Active',
    icon: 'fas fa-arrow-down',
  },
  {
    id: 2,
    type: 'earning',
    amount: 1567,
    description: 'Daily Yield Payout',
    time: 'Today, 10:30',
    status: 'Completed',
    icon: 'fas fa-coins',
  },
  {
    id: 3,
    type: 'withdrawal',
    amount: -5000,
    description: 'Withdrawal to Bank',
    time: 'Yesterday',
    status: 'Processing',
    icon: 'fas fa-wallet',
  },
  {
    id: 4,
    type: 'investment',
    amount: 100000,
    description: 'VIP Fund Investment',
    time: '2 days ago',
    status: 'Active',
    icon: 'fas fa-crown',
  },
])

// Computed
const currentTerm = computed(() => {
  const terms = {
    7: { apr: 7.0, dailyYield: 1.0 },
    14: { apr: 8.4, dailyYield: 0.6 },
    30: { apr: 12.5, dailyYield: 0.42 },
    60: { apr: 15.0, dailyYield: 0.25 },
    90: { apr: 18.0, dailyYield: 0.2 },
    180: { apr: 24.0, dailyYield: 0.13 },
  }
  return terms[calculatorTerm.value] || terms[7]
})

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

const scrollCarousel = (direction) => {
  if (!opportunitiesCarousel.value) return

  const scrollAmount = 320 // Card width + gap
  opportunitiesCarousel.value.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth',
  })
}

const calculateDailyEarnings = () => {
  const dailyRate = currentTerm.value.dailyYield / 100
  return (calculatorAmount.value * dailyRate).toFixed(2)
}

const calculateTotalEarnings = () => {
  const dailyEarnings = parseFloat(calculateDailyEarnings())
  return (dailyEarnings * calculatorTerm.value).toFixed(2)
}

const calculateFinalAmount = () => {
  const totalEarnings = parseFloat(calculateTotalEarnings())
  return (calculatorAmount.value + totalEarnings).toFixed(2)
}

const calculateAPR = () => {
  return currentTerm.value.apr
}

const calculateMaturityDate = () => {
  const today = new Date()
  today.setDate(today.getDate() + calculatorTerm.value)
  return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const investNow = () => {
  if (calculatorAmount.value < 5000) {
    alert('Minimum investment is $5,000 USDT')
    return
  }
  showInvestmentModal.value = true
}

const confirmInvestment = () => {
  showInvestmentModal.value = false
  setTimeout(() => {
    showSuccessModal.value = true
  }, 500)
}

const viewInvestmentDetails = (investment) => {
  alert(`Viewing details for: ${investment.name}`)
}

const openInvestModal = (opportunity) => {
  calculatorAmount.value = opportunity.minAmount
  calculatorTerm.value = opportunity.term
  investNow()
}

const showAllInvestments = () => {
  alert('All investments view would open')
}

const showAllActivity = () => {
  alert('All activity view would open')
}

const viewActivityDetails = (activity) => {
  alert(`Activity details: ${activity.description}`)
}

const showNotifications = () => {
  alert('Notifications modal would open')
}

const showSettings = () => {
  alert('Settings modal would open')
}

// Initialize
onMounted(() => {
  // Any initialization logic
})
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Hide scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom scrollbar for activity */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #00e0ff, #0080ff);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #00e0ff, #0080ff);
}
</style>

<!-- Investment Opportunity Card Component -->
<script>
const InvestmentOpportunityCard = {
  props: {
    opportunity: Object
  },
  template: `
    <div class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/10 h-full">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-bold text-lg">{{ opportunity.name }}</h4>
        <div class="text-xs px-3 py-1 rounded-full"
             :class="{
               'bg-green-500/20 text-green-300': opportunity.risk === 'Low',
               'bg-yellow-500/20 text-yellow-300': opportunity.risk === 'Medium',
               'bg-red-500/20 text-red-300': opportunity.risk === 'High'
             }">
          {{ opportunity.risk }} Risk
        </div>
      </div>

      <div class="mb-4">
        <div class="text-3xl font-bold bg-gradient-to-r" :class="opportunity.color" style="-webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          {{ opportunity.apr }}%
        </div>
        <div class="text-sm opacity-70">APR • {{ opportunity.term }} days</div>
      </div>

      <div class="space-y-2 mb-4">
        <div v-for="feature in opportunity.features" :key="feature" class="flex items-center text-sm">
          <i class="fas fa-check text-green-400 mr-2 text-xs"></i>
          <span class="opacity-90">{{ feature }}</span>
        </div>
      </div>

      <div class="text-xs opacity-70 mb-3">Min: ${{ opportunity.minAmount.toLocaleString() }}</div>

      <button
        @click="$emit('invest')"
        class="w-full py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
      >
        Invest Now
      </button>
    </div>
  `
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0b0f2a] via-[#15193a] to-[#1a1f3d] text-white pb-32"
  >
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-br from-[#0b0f2a] via-[#15193a] to-[#1a1f3d]"
      ></div>
      <!-- Animated gradient orbs -->
      <div
        class="absolute top-10 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"
      ></div>
      <!-- Animated grid pattern -->
      <div
        class="absolute inset-0 opacity-5"
        style="
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        "
      ></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 pt-8 pb-6 px-4">
      <div class="flex items-center justify-between mb-6">
        <button
          @click="$emit('back')"
          class="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm"
        >
          <i class="fas fa-arrow-left text-lg"></i>
        </button>

        <div class="text-center">
          <h1
            class="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Membership Upgrade
          </h1>
          <p class="text-sm opacity-70 mt-1">Unlock Premium Trading Features</p>
        </div>

        <button
          @click="showBenefits"
          class="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm"
        >
          <i class="fas fa-crown text-lg"></i>
        </button>
      </div>

      <!-- Current Status Card -->
      <div
        class="relative overflow-hidden rounded-2xl p-5 mb-6 backdrop-blur-xl border border-cyan-500/30"
        style="background: linear-gradient(135deg, rgba(0, 230, 118, 0.1), rgba(59, 130, 246, 0.1))"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"
        ></div>

        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center space-x-4">
            <div
              class="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"
            >
              <i class="fas fa-crown text-2xl"></i>
            </div>
            <div>
              <div class="text-sm opacity-80">Current Level</div>
              <div class="text-2xl font-bold">VIP 3</div>
              <div class="text-xs opacity-70">Next: VIP 4 in $15,998.5</div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-sm opacity-80 mb-1">Progress</div>
            <div class="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                style="width: 45%"
              ></div>
            </div>
            <div class="text-xs opacity-70 mt-1">45% to next level</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Upgrade Card Carousel -->
    <div class="relative z-10 px-4 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">Select VIP Level</h2>
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
        ref="carousel"
        class="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x snap-mandatory"
        style="scroll-behavior: smooth"
      >
        <div
          v-for="(level, index) in membershipLevels"
          :key="index"
          class="flex-shrink-0 w-80 snap-center"
          @click="selectLevel(level)"
        >
          <MembershipCard
            :level="level"
            :is-selected="selectedLevel?.title === level.title"
            :is-current="currentLevel === level.title"
          />
        </div>
      </div>
    </div>

    <!-- Membership Grid -->
    <div class="relative z-10 px-4 mb-10">
      <h2 class="text-lg font-bold mb-4">All Membership Levels</h2>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(level, index) in membershipLevels"
          :key="index"
          @click="selectLevel(level)"
          class="relative overflow-hidden rounded-2xl p-5 backdrop-blur-xl border transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
          :class="[
            selectedLevel?.title === level.title
              ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
              : 'border-white/10 hover:border-cyan-500/30',
            level.hot ? 'ring-2 ring-red-500/50' : '',
          ]"
          :style="{
            background: `linear-gradient(135deg, ${level.bgFrom}20, ${level.bgTo}20)`,
          }"
        >
          <!-- Hot Badge -->
          <div v-if="level.hot" class="absolute top-3 left-3 z-20">
            <div class="relative">
              <div class="absolute inset-0 bg-red-500 blur-md"></div>
              <div
                class="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full"
              >
                <i class="fas fa-fire mr-1"></i> HOT
              </div>
            </div>
          </div>

          <!-- Current Level Badge -->
          <div v-if="currentLevel === level.title" class="absolute top-3 right-3 z-20">
            <div
              class="bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full"
            >
              <i class="fas fa-check mr-1"></i> CURRENT
            </div>
          </div>

          <!-- VIP Level Badge -->
          <div class="absolute top-14 right-5 z-10 opacity-20">
            <i class="fas fa-crown text-6xl" :style="{ color: level.iconColor }"></i>
          </div>

          <!-- Level Title -->
          <div class="mb-4">
            <div class="flex items-center space-x-2">
              <div class="text-4xl font-bold" :style="{ color: level.titleColor }">
                {{ level.title }}
              </div>
              <div class="text-sm opacity-70">Level {{ index + 1 }}</div>
            </div>
            <div class="text-xs opacity-70 mt-1">{{ level.subtitle }}</div>
          </div>

          <!-- Stats -->
          <div class="space-y-3 mb-4">
            <div class="flex items-center justify-between">
              <div class="text-sm opacity-80">Required Deposit</div>
              <div class="font-bold text-lg" :style="{ color: level.titleColor }">
                ${{ formatNumber(level.deposit) }}
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <div class="opacity-80">Daily Limit</div>
                <div class="font-semibold">${{ formatNumber(level.daily) }}</div>
              </div>
              <div class="flex items-center justify-between text-sm">
                <div class="opacity-80">Monthly Limit</div>
                <div class="font-semibold">${{ formatNumber(level.monthly) }}</div>
              </div>
            </div>
          </div>

          <!-- Upgrade Button -->
          <button
            class="w-full py-3 rounded-xl font-semibold transition-all duration-300"
            :class="[
              currentLevel === level.title
                ? 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-300 border border-green-500/30'
                : selectedLevel?.title === level.title
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                  : 'bg-white/10 text-white/80 hover:bg-white/20',
            ]"
            @click.stop="initiateUpgrade(level)"
          >
            {{
              currentLevel === level.title
                ? 'Current Level'
                : selectedLevel?.title === level.title
                  ? 'Selected'
                  : 'Select'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Selected Level Details -->
    <div v-if="selectedLevel" class="relative z-10 px-4 mb-8">
      <div
        class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold">
            <span :style="{ color: selectedLevel.titleColor }">{{ selectedLevel.title }}</span>
            <span class="opacity-70"> Upgrade Details</span>
          </h3>
          <div class="flex items-center space-x-2">
            <div class="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">
              {{ selectedLevel.upgradeType }}
            </div>
            <div
              v-if="selectedLevel.recommended"
              class="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full"
            >
              RECOMMENDED
            </div>
          </div>
        </div>

        <!-- Benefits Grid -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-black/30 rounded-xl p-4">
            <div class="flex items-center space-x-3 mb-2">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center"
              >
                <i class="fas fa-chart-line"></i>
              </div>
              <div>
                <div class="font-semibold">Trading Fee</div>
                <div class="text-2xl font-bold text-green-400">{{ selectedLevel.tradingFee }}%</div>
              </div>
            </div>
            <div class="text-xs opacity-70">{{ selectedLevel.feeDescription }}</div>
          </div>

          <div class="bg-black/30 rounded-xl p-4">
            <div class="flex items-center space-x-3 mb-2">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              >
                <i class="fas fa-bolt"></i>
              </div>
              <div>
                <div class="font-semibold">Priority</div>
                <div class="text-2xl font-bold text-purple-400">
                  Level {{ selectedLevel.priorityLevel }}
                </div>
              </div>
            </div>
            <div class="text-xs opacity-70">{{ selectedLevel.priorityDescription }}</div>
          </div>
        </div>

        <!-- Feature List -->
        <div class="space-y-3 mb-6">
          <h4 class="font-semibold mb-2">Unlocked Features</h4>
          <div
            v-for="(feature, idx) in selectedLevel.features"
            :key="idx"
            class="flex items-center space-x-3"
          >
            <i class="fas fa-check-circle text-green-400"></i>
            <span class="text-sm">{{ feature }}</span>
          </div>
        </div>

        <!-- Comparison -->
        <div class="space-y-3">
          <h4 class="font-semibold mb-2">Comparison</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span>Daily Withdrawal Limit</span>
              <span class="font-semibold">${{ formatNumber(selectedLevel.daily) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span>Monthly Trading Limit</span>
              <span class="font-semibold">${{ formatNumber(selectedLevel.monthly) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span>Minimum Deposit</span>
              <span class="font-semibold text-green-400"
                >${{ formatNumber(selectedLevel.deposit) }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Action Panel -->
    <div
      class="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#0b0f2a] to-transparent"
    >
      <div
        class="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30 shadow-2xl"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm opacity-80">Selected Upgrade</div>
            <div class="text-xl font-bold" :style="{ color: selectedLevel?.titleColor || '#fff' }">
              {{ selectedLevel?.title || 'None selected' }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm opacity-80">Required Deposit</div>
            <div class="text-2xl font-bold text-green-400">
              ${{ selectedLevel ? formatNumber(selectedLevel.deposit) : '0' }}
            </div>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            @click="showComparisonModal = true"
            class="flex-1 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
          >
            <i class="fas fa-chart-bar"></i>
            <span>Compare</span>
          </button>

          <button
            @click="initiateUpgrade(selectedLevel)"
            :disabled="!selectedLevel"
            class="flex-1 py-3 rounded-xl font-bold transition-all duration-300 relative overflow-hidden group"
            :class="
              selectedLevel
                ? 'bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-green-500/30'
                : 'bg-gradient-to-r from-gray-700 to-gray-800 opacity-50 cursor-not-allowed'
            "
          >
            <!-- Animated gradient overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-green-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-green-500/20 group-hover:via-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-500"
            ></div>

            <div class="relative z-10 flex items-center justify-center space-x-2">
              <i class="fas fa-arrow-up"></i>
              <span>Upgrade Now</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Upgrade Confirmation Modal -->
    <div
      v-if="showUpgradeModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        class="bg-gradient-to-br from-gray-900 to-black rounded-2xl w-full max-w-md border border-cyan-500/30 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">Confirm Upgrade</h3>
            <button @click="showUpgradeModal = false" class="p-2 hover:bg-white/10 rounded-lg">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <!-- Current vs New -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-black/30 rounded-xl p-4 text-center">
                <div class="text-sm opacity-70 mb-2">Current</div>
                <div class="text-2xl font-bold text-gray-400">VIP 3</div>
                <div class="text-xs opacity-70 mt-1">${{ formatNumber(3001) }}/day</div>
              </div>
              <div
                class="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl p-4 text-center border border-cyan-500/30"
              >
                <div class="text-sm opacity-70 mb-2">Upgrading To</div>
                <div class="text-2xl font-bold" :style="{ color: selectedLevel?.titleColor }">
                  {{ selectedLevel?.title }}
                </div>
                <div class="text-xs opacity-70 mt-1">
                  ${{ selectedLevel ? formatNumber(selectedLevel.daily) : '0' }}/day
                </div>
              </div>
            </div>

            <!-- Upgrade Details -->
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-black/30 rounded-xl">
                <div class="text-sm opacity-70">Required Deposit</div>
                <div class="text-lg font-bold text-green-400">
                  ${{ selectedLevel ? formatNumber(selectedLevel.deposit) : '0' }}
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-black/30 rounded-xl">
                <div class="text-sm opacity-70">Daily Limit Increase</div>
                <div class="text-lg font-bold text-cyan-400">
                  +${{ selectedLevel ? formatNumber(selectedLevel.daily - 30000) : '0' }}
                </div>
              </div>

              <div
                v-if="selectedLevel?.instantUpgrade"
                class="p-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl border border-green-500/30"
              >
                <div class="flex items-center text-green-400">
                  <i class="fas fa-bolt mr-2"></i>
                  <span class="text-sm">Instant upgrade - No waiting period!</span>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="space-y-2">
              <h4 class="font-semibold text-sm">Payment Method</h4>
              <div class="flex space-x-2">
                <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  @click="selectedPaymentMethod = method.id"
                  class="flex-1 py-3 rounded-lg border flex flex-col items-center justify-center"
                  :class="
                    selectedPaymentMethod === method.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  "
                >
                  <i :class="method.icon" class="text-lg mb-1"></i>
                  <span class="text-xs">{{ method.name }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 flex space-x-3">
            <button
              @click="showUpgradeModal = false"
              class="flex-1 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="processUpgrade"
              class="flex-1 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Confirm & Pay
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
        <!-- Confetti Effect -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            v-for="n in 30"
            :key="n"
            class="absolute w-2 h-2 rounded-full"
            :style="{
              background: confettiColors[Math.floor(Math.random() * confettiColors.length)],
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `confetti-fall ${Math.random() * 2 + 1}s ease-in forwards`,
            }"
          ></div>
        </div>

        <div
          class="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-cyan-500/30"
        >
          <div
            class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center animate-bounce"
          >
            <i class="fas fa-crown text-4xl"></i>
          </div>
          <h3 class="text-2xl font-bold mb-2">Upgrade Successful!</h3>
          <p class="opacity-80 mb-6">You are now a {{ selectedLevel?.title }} member</p>

          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between">
              <span class="opacity-70">New Daily Limit</span>
              <span class="font-bold text-green-400"
                >${{ selectedLevel ? formatNumber(selectedLevel.daily) : '0' }}</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="opacity-70">Trading Fee</span>
              <span class="font-bold text-cyan-400">{{ selectedLevel?.tradingFee }}%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="opacity-70">Priority Level</span>
              <span class="font-bold text-purple-400">{{ selectedLevel?.priorityLevel }}</span>
            </div>
          </div>

          <button
            @click="showSuccessModal = false"
            class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold"
          >
            Continue Trading
          </button>
        </div>
      </div>
    </div>

    <!-- Comparison Modal -->
    <div
      v-if="showComparisonModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        class="bg-gradient-to-br from-gray-900 to-black rounded-2xl w-full max-w-4xl border border-cyan-500/30 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">VIP Levels Comparison</h3>
            <button @click="showComparisonModal = false" class="p-2 hover:bg-white/10 rounded-lg">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[600px]">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left py-3 px-4">Level</th>
                  <th class="text-left py-3 px-4">Deposit</th>
                  <th class="text-left py-3 px-4">Daily Limit</th>
                  <th class="text-left py-3 px-4">Fee</th>
                  <th class="text-left py-3 px-4">Priority</th>
                  <th class="text-left py-3 px-4">Features</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(level, index) in membershipLevels"
                  :key="index"
                  class="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td class="py-3 px-4">
                    <div class="font-bold" :style="{ color: level.titleColor }">
                      {{ level.title }}
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-semibold">${{ formatNumber(level.deposit) }}</div>
                  </td>
                  <td class="py-3 px-4">
                    <div>${{ formatNumber(level.daily) }}</div>
                  </td>
                  <td class="py-3 px-4">
                    <div
                      class="font-semibold"
                      :class="{
                        'text-green-400': level.tradingFee < 0.1,
                        'text-yellow-400': level.tradingFee >= 0.1 && level.tradingFee < 0.2,
                        'text-gray-400': level.tradingFee >= 0.2,
                      }"
                    >
                      {{ level.tradingFee }}%
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center">
                      <div class="w-full bg-white/10 rounded-full h-2">
                        <div
                          class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                          :style="{ width: level.priorityLevel * 20 + '%' }"
                        ></div>
                      </div>
                      <span class="ml-2 text-sm">{{ level.priorityLevel }}/5</span>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="text-xs space-y-1">
                      <div
                        v-for="(feature, idx) in level.features.slice(0, 2)"
                        :key="idx"
                        class="flex items-center"
                      >
                        <i class="fas fa-check text-green-400 mr-1 text-xs"></i>
                        {{ feature }}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6 flex justify-center">
            <button
              @click="showComparisonModal = false"
              class="px-8 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['back'])

// Refs
const carousel = ref(null)
const selectedLevel = ref(null)
const showUpgradeModal = ref(false)
const showSuccessModal = ref(false)
const showComparisonModal = ref(false)
const selectedPaymentMethod = ref('usdt')
const currentLevel = ref('V3') // User's current level

// Confetti colors
const confettiColors = ['#00e676', '#00bcd4', '#2196f3', '#9c27b0', '#ff9800', '#ff5252']

// Payment Methods
const paymentMethods = [
  { id: 'usdt', name: 'USDT', icon: 'fas fa-coins' },
  { id: 'btc', name: 'BTC', icon: 'fab fa-bitcoin' },
  { id: 'eth', name: 'ETH', icon: 'fab fa-ethereum' },
  { id: 'card', name: 'Card', icon: 'fas fa-credit-card' },
]

// Enhanced Membership Levels Data
const membershipLevels = ref([
  {
    title: 'V1',
    subtitle: 'Starter',
    deposit: 51.0,
    daily: 10.0,
    monthly: 50,
    tradingFee: 0.25,
    feeDescription: 'Standard trading fee',
    priorityLevel: 1,
    priorityDescription: 'Normal priority',
    upgradeType: 'Basic',
    recommended: false,
    instantUpgrade: true,
    titleColor: '#9ca3af',
    iconColor: '#9ca3af',
    bgFrom: '#9ca3af',
    bgTo: '#6b7280',
    features: [
      'Basic trading access',
      'Standard withdrawal limits',
      'Email support',
      'Market data access',
    ],
  },
  {
    title: 'V2',
    subtitle: 'Advanced',
    deposit: 1498.5,
    daily: 100.0,
    monthly: 3000,
    tradingFee: 0.2,
    feeDescription: 'Reduced trading fee',
    priorityLevel: 2,
    priorityDescription: 'Improved priority',
    upgradeType: 'Premium',
    recommended: false,
    instantUpgrade: true,
    titleColor: '#3b82f6',
    iconColor: '#3b82f6',
    bgFrom: '#3b82f6',
    bgTo: '#1d4ed8',
    features: [
      'Advanced charting tools',
      'Higher withdrawal limits',
      'Priority email support',
      'Basic analytics',
    ],
  },
  {
    title: 'V3',
    subtitle: 'Professional',
    deposit: 3001,
    daily: 30000.0,
    monthly: 900000,
    tradingFee: 0.15,
    feeDescription: 'Professional fee rate',
    priorityLevel: 3,
    priorityDescription: 'High priority',
    upgradeType: 'Professional',
    hot: true,
    recommended: true,
    instantUpgrade: true,
    titleColor: '#10b981',
    iconColor: '#10b981',
    bgFrom: '#10b981',
    bgTo: '#059669',
    features: [
      'Professional tools access',
      'High-frequency trading',
      '24/7 chat support',
      'Advanced analytics',
    ],
  },
  {
    title: 'V4',
    subtitle: 'Elite',
    deposit: 29998.5,
    daily: 100000.0,
    monthly: 3000000,
    tradingFee: 0.1,
    feeDescription: 'Elite trading fee',
    priorityLevel: 4,
    priorityDescription: 'Very high priority',
    upgradeType: 'Elite',
    recommended: false,
    instantUpgrade: false,
    titleColor: '#8b5cf6',
    iconColor: '#8b5cf6',
    bgFrom: '#8b5cf6',
    bgTo: '#7c3aed',
    features: [
      'Institutional tools',
      'Unlimited withdrawals',
      'VIP support line',
      'Custom analytics',
    ],
  },
  {
    title: 'V5',
    subtitle: 'Premium',
    deposit: 30001,
    daily: 200000.0,
    monthly: 6000000,
    tradingFee: 0.08,
    feeDescription: 'Premium fee rate',
    priorityLevel: 4,
    priorityDescription: 'Premium priority',
    upgradeType: 'Premium',
    recommended: true,
    instantUpgrade: false,
    titleColor: '#f59e0b',
    iconColor: '#f59e0b',
    bgFrom: '#f59e0b',
    bgTo: '#d97706',
    features: [
      'All institutional features',
      'Personal account manager',
      'Direct exchange access',
      'Custom API solutions',
    ],
  },
  {
    title: 'V6',
    subtitle: 'Exclusive',
    deposit: 99998.5,
    daily: 2000000.0,
    monthly: 60000000,
    tradingFee: 0.05,
    feeDescription: 'Exclusive lowest fee',
    priorityLevel: 5,
    priorityDescription: 'Highest priority',
    upgradeType: 'Exclusive',
    recommended: false,
    instantUpgrade: false,
    titleColor: '#ef4444',
    iconColor: '#ef4444',
    bgFrom: '#ef4444',
    bgTo: '#dc2626',
    features: [
      'All premium features',
      'Dedicated trading team',
      'Direct CEO access',
      'Custom development',
    ],
  },
])

// Computed
const nextLevel = computed(() => {
  const currentIndex = membershipLevels.value.findIndex((l) => l.title === currentLevel.value)
  return currentIndex < membershipLevels.value.length - 1
    ? membershipLevels.value[currentIndex + 1]
    : null
})

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

const scrollCarousel = (direction) => {
  if (!carousel.value) return

  const scrollAmount = 320 // Card width + gap
  carousel.value.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth',
  })
}

const selectLevel = (level) => {
  selectedLevel.value = level
}

const initiateUpgrade = (level) => {
  if (currentLevel.value === level.title) {
    alert('You are already at this level!')
    return
  }

  selectLevel(level)
  showUpgradeModal.value = true
}

const processUpgrade = () => {
  showUpgradeModal.value = false

  // Simulate API call
  setTimeout(() => {
    showSuccessModal.value = true
    currentLevel.value = selectedLevel.value.title

    // In real app, update user's level in backend
  }, 1500)
}

const showBenefits = () => {
  alert('VIP benefits modal would open here')
}

// Initialize
onMounted(() => {
  // Auto-select current level
  selectedLevel.value = membershipLevels.value.find((l) => l.title === currentLevel.value)
})
</script>

<style scoped>
/* Custom animations */
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

@keyframes gradient-shift {
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

.gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
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

/* Card glow effect */
.glow-effect {
  box-shadow: 0 0 40px rgba(0, 230, 118, 0.3);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- Membership Card Component -->
<script>
const MembershipCard = {
  props: {
    level: Object,
    isSelected: Boolean,
    isCurrent: Boolean,
  },
  computed: {
    formattedDaily() {
      return this.formatNumber(this.level.daily)
    },
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num)
    },
  },
  template: `
    <div
      class="relative overflow-hidden rounded-2xl p-6 h-full backdrop-blur-xl border transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
      :class="[
        isSelected ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20' : 'border-white/10 hover:border-cyan-500/30',
        isCurrent ? 'ring-2 ring-green-500/50' : ''
      ]"
      :style="{
        background: \`linear-gradient(135deg, \${level.bgFrom}20, \${level.bgTo}20)\`
      }"
    >
      <!-- Hot Badge -->
      <div v-if="level.hot" class="absolute top-3 left-3 z-20">
        <div class="relative">
          <div class="absolute inset-0 bg-red-500 blur-md"></div>
          <div class="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            <i class="fas fa-fire mr-1"></i> HOT
          </div>
        </div>
      </div>

      <!-- Current Badge -->
      <div v-if="isCurrent" class="absolute top-3 right-3 z-20">
        <div class="bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          <i class="fas fa-check mr-1"></i> CURRENT
        </div>
      </div>

      <!-- Level Icon -->
      <div class="absolute top-5 right-5 opacity-20">
        <i class="fas fa-crown text-5xl" :style="{ color: level.iconColor }"></i>
      </div>

      <!-- Level Title -->
      <div class="mb-6">
        <div class="text-4xl font-bold mb-2" :style="{ color: level.titleColor }">
          {{ level.title }}
        </div>
        <div class="text-sm opacity-70">{{ level.subtitle }}</div>
      </div>

      <!-- Stats -->
      <div class="space-y-3 mb-6">
        <div class="flex items-center justify-between">
          <div class="text-sm opacity-80">Daily Limit</div>
          <div class="font-bold" :style="{ color: level.titleColor }">
            ${{ formattedDaily }}
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="text-sm opacity-80">Trading Fee</div>
          <div class="font-bold text-green-400">{{ level.tradingFee }}%</div>
        </div>
      </div>

      <!-- Features -->
      <div class="space-y-2 mb-6">
        <div v-for="(feature, idx) in level.features.slice(0, 2)" :key="idx" class="flex items-center text-sm">
          <i class="fas fa-check text-green-400 mr-2 text-xs"></i>
          <span class="opacity-90">{{ feature }}</span>
        </div>
      </div>

      <!-- Action Button -->
      <button
        class="w-full py-3 rounded-xl font-semibold transition-all duration-300"
        :class="[
          isCurrent
            ? 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-300 border border-green-500/30'
            : isSelected
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30'
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        ]"
      >
        {{ isCurrent ? 'Current Level' : isSelected ? 'Selected' : 'Select' }}
      </button>
    </div>
  `,
}
</script>

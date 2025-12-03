<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0b0f2a] via-[#15193a] to-[#1a1f3d] text-white p-4"
  >
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0">
      <div
        class="absolute inset-0 bg-gradient-to-br from-[#0b0f2a] via-[#15193a] to-[#1a1f3d]"
      ></div>
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
        ></div>
        <div
          class="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"
        ></div>
        <div
          class="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"
        ></div>
      </div>
    </div>

    <!-- Header -->
    <header class="relative z-10 flex items-center justify-between mb-8 pt-4">
      <button
        @click="$emit('back')"
        class="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
      >
        <i class="fas fa-arrow-left text-lg"></i>
      </button>

      <div class="text-center">
        <h1
          class="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
        >
          Internal Transfer
        </h1>
        <p class="text-xs opacity-70 mt-1">Secure & Instant Transfers</p>
      </div>

      <div class="w-10"></div>
      <!-- Spacer for alignment -->
    </header>

    <!-- User Info Card -->
    <div class="relative z-10 mb-6">
      <div
        class="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/20 shadow-2xl"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"
            >
              <i class="fas fa-user-crown text-white"></i>
            </div>
            <div>
              <h3 class="font-semibold text-sm">VIP 6 Account</h3>
              <p class="text-xs opacity-70">Maximum Transfer Privileges</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs opacity-70">Daily Limit</div>
            <div class="text-lg font-bold text-cyan-300">$2,000,000</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-black/20 rounded-xl p-3">
            <div class="text-xs opacity-70 mb-1">Available Balance</div>
            <div class="text-xl font-bold text-green-400">{{ formattedBalance }}</div>
          </div>
          <div class="bg-black/20 rounded-xl p-3">
            <div class="text-xs opacity-70 mb-1">Today's Transfers</div>
            <div class="text-xl font-bold">{{ dailyTransfers }} USDT</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Transfer Card -->
    <div class="relative z-10 mb-8">
      <div
        class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl"
      >
        <!-- Balance Display -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium opacity-80">Available Balance</label>
            <button
              @click="amount = balance"
              class="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-lg hover:bg-cyan-500/30 transition-colors"
            >
              Use Max
            </button>
          </div>
          <div class="flex items-center space-x-2 bg-black/30 rounded-xl p-4">
            <div
              class="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center"
            >
              <i class="fas fa-coins"></i>
            </div>
            <div class="flex-1">
              <div class="text-2xl font-bold">{{ formattedBalance }}</div>
              <div class="text-xs opacity-70">USDT Tether</div>
            </div>
            <div class="text-green-400 text-sm font-semibold">
              <i class="fas fa-arrow-up mr-1"></i>
              2.4%
            </div>
          </div>
        </div>

        <!-- Recipient Selection -->
        <div class="mb-6">
          <label class="text-sm font-medium opacity-80 mb-2 block">Recipient Account</label>

          <div class="relative">
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
              <i class="fas fa-user-friends"></i>
            </div>
            <input
              v-model="recipient"
              type="text"
              placeholder="Enter recipient username or scan QR"
              class="w-full pl-12 pr-4 py-4 bg-black/40 border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-all"
              :class="{ 'border-red-500/50': recipientError }"
            />
            <button
              @click="showQRScanner = true"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <i class="fas fa-qrcode text-cyan-400"></i>
            </button>
          </div>

          <!-- Recipient Suggestions -->
          <div v-if="showSuggestions" class="mt-3 space-y-2">
            <div
              v-for="suggestion in recipientSuggestions"
              :key="suggestion.id"
              @click="selectRecipient(suggestion)"
              class="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                >
                  <span class="text-xs">{{ suggestion.name.charAt(0) }}</span>
                </div>
                <div>
                  <div class="font-medium">{{ suggestion.name }}</div>
                  <div class="text-xs opacity-70">{{ suggestion.account }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs opacity-70">VIP {{ suggestion.vipLevel }}</div>
                <div class="text-xs text-green-400">{{ suggestion.limit }} Limit</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Amount Input -->
        <div class="mb-6">
          <label class="text-sm font-medium opacity-80 mb-2 block">Transfer Amount</label>

          <div class="relative">
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <input
              v-model="amount"
              type="number"
              :min="0"
              :max="balance"
              step="0.01"
              placeholder="Enter amount"
              class="w-full pl-12 pr-4 py-4 bg-black/40 border-2 border-green-500/30 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all text-lg"
              :class="{ 'border-red-500/50': amountError }"
            />
            <div
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 font-semibold"
            >
              USDT
            </div>
          </div>

          <!-- Amount Quick Select -->
          <div class="flex space-x-2 mt-3">
            <button
              v-for="quickAmount in quickAmounts"
              :key="quickAmount"
              @click="amount = quickAmount"
              class="flex-1 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              {{ quickAmount }}
            </button>
          </div>
        </div>

        <!-- Security Verification -->
        <div class="mb-6" v-if="!isVIP6">
          <label class="text-sm font-medium opacity-80 mb-2 block">Security Verification</label>
          <div class="relative">
            <input
              v-model="securityKey"
              type="password"
              placeholder="Enter security key"
              class="w-full pl-12 pr-4 py-4 bg-black/40 border-2 border-yellow-500/30 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-all"
            />
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400">
              <i class="fas fa-key"></i>
            </div>
          </div>
          <div class="text-xs text-yellow-400 mt-2">
            <i class="fas fa-shield-alt mr-1"></i>
            Required for transfers above VIP limits
          </div>
        </div>
      </div>
    </div>

    <!-- VIP Information -->
    <div class="relative z-10 mb-10">
      <div
        class="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20"
      >
        <div class="flex items-center justify-between mb-4">
          <h3
            class="font-bold text-lg bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            VIP Transfer Limits
          </h3>
          <div class="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
            Daily Limits
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="vip in vipLevels"
            :key="vip.level"
            class="flex items-center justify-between p-3 rounded-xl transition-all"
            :class="{
              'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30':
                vip.level === 6,
              'hover:bg-white/5': vip.level !== 6,
            }"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center"
                :class="getVIPColorClass(vip.level)"
              >
                <span class="text-xs font-bold">{{ vip.level }}</span>
              </div>
              <div>
                <div class="font-medium">VIP {{ vip.level }}</div>
                <div class="text-xs opacity-70">{{ vip.benefit }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold">{{ vip.limit }}</div>
              <div class="text-xs opacity-70">USDT</div>
            </div>
          </div>
        </div>

        <div
          class="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl border border-green-500/30"
        >
          <div class="flex items-center text-green-400">
            <i class="fas fa-crown mr-2"></i>
            <span class="text-sm font-semibold"
              >VIP 6 Privilege: One-click transfer without key verification!</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="relative z-10 mb-20">
      <div class="flex space-x-3">
        <button
          @click="scanQR"
          class="flex-1 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl border border-cyan-500/30 flex flex-col items-center justify-center hover:bg-cyan-500/30 transition-all group"
        >
          <i
            class="fas fa-qrcode text-2xl text-cyan-400 mb-2 group-hover:scale-110 transition-transform"
          ></i>
          <span class="text-sm">Scan QR</span>
        </button>

        <button
          @click="showHistory"
          class="flex-1 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl border border-purple-500/30 flex flex-col items-center justify-center hover:bg-purple-500/30 transition-all group"
        >
          <i
            class="fas fa-history text-2xl text-purple-400 mb-2 group-hover:scale-110 transition-transform"
          ></i>
          <span class="text-sm">History</span>
        </button>

        <button
          @click="addFavorite"
          class="flex-1 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl border border-yellow-500/30 flex flex-col items-center justify-center hover:bg-yellow-500/30 transition-all group"
        >
          <i
            class="fas fa-star text-2xl text-yellow-400 mb-2 group-hover:scale-110 transition-transform"
          ></i>
          <span class="text-sm">Favorites</span>
        </button>
      </div>
    </div>

    <!-- Transfer Button -->
    <div
      class="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#0b0f2a] to-transparent"
    >
      <button
        @click="initiateTransfer"
        :disabled="!canTransfer"
        class="w-full py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 relative overflow-hidden group"
        :class="
          canTransfer
            ? 'bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 hover:shadow-green-500/30 hover:scale-[1.02]'
            : 'bg-gradient-to-r from-gray-700 to-gray-800 opacity-50 cursor-not-allowed'
        "
      >
        <!-- Animated gradient overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-green-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-green-500/20 group-hover:via-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-500"
        ></div>

        <div class="relative z-10 flex items-center justify-center space-x-2">
          <i class="fas fa-paper-plane"></i>
          <span>Transfer Now</span>
        </div>

        <!-- Loading animation for processing -->
        <div
          v-if="isProcessing"
          class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl"
        >
          <div
            class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></div>
        </div>
      </button>

      <div v-if="transferFee > 0" class="text-center text-xs opacity-70 mt-2">
        Network Fee: <span class="text-green-400">{{ transferFee }} USDT</span>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmation"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        class="bg-gradient-to-br from-gray-900 to-black rounded-2xl w-full max-w-md border border-cyan-500/30 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">Confirm Transfer</h3>
            <button @click="showConfirmation = false" class="p-2 hover:bg-white/10 rounded-lg">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div class="text-sm opacity-70">Amount</div>
              <div class="text-xl font-bold text-green-400">{{ amount }} USDT</div>
            </div>

            <div class="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div class="text-sm opacity-70">To</div>
              <div class="font-medium">{{ recipient }}</div>
            </div>

            <div class="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div class="text-sm opacity-70">Fee</div>
              <div class="text-cyan-400">{{ transferFee }} USDT</div>
            </div>

            <div
              class="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl border border-green-500/30"
            >
              <div class="text-sm opacity-70">Total</div>
              <div class="text-lg font-bold">{{ totalWithFee }} USDT</div>
            </div>
          </div>

          <div class="mt-6 flex space-x-3">
            <button
              @click="showConfirmation = false"
              class="flex-1 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="processTransfer"
              class="flex-1 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Animation -->
    <div
      v-if="showSuccess"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div class="text-center">
        <div
          class="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center animate-bounce"
        >
          <i class="fas fa-check text-4xl"></i>
        </div>
        <h3 class="text-2xl font-bold mb-2">Transfer Successful!</h3>
        <p class="opacity-80 mb-6">{{ amount }} USDT has been transferred to {{ recipient }}</p>
        <button
          @click="resetForm"
          class="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold"
        >
          Make Another Transfer
        </button>
      </div>
    </div>

    <!-- QR Scanner Modal -->
    <div
      v-if="showQRScanner"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        class="bg-gradient-to-br from-gray-900 to-black rounded-2xl w-full max-w-md border border-cyan-500/30 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">Scan QR Code</h3>
            <button @click="showQRScanner = false" class="p-2 hover:bg-white/10 rounded-lg">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="bg-black/50 rounded-xl p-8 mb-6 flex items-center justify-center">
            <div class="text-center">
              <div
                class="w-48 h-48 mx-auto mb-4 border-4 border-dashed border-cyan-500/50 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-qrcode text-6xl text-cyan-400/50"></i>
              </div>
              <p class="text-sm opacity-70">Point camera at recipient's QR code</p>
            </div>
          </div>

          <div class="space-y-3">
            <button
              class="w-full py-3 bg-cyan-500/20 text-cyan-300 rounded-xl flex items-center justify-center space-x-2"
            >
              <i class="fas fa-camera"></i>
              <span>Open Camera</span>
            </button>
            <button @click="showQRScanner = false" class="w-full py-3 bg-white/10 rounded-xl">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['back'])

// User Data
const balance = ref(6838616.47)
const dailyTransfers = ref(1250000.0)
const isVIP6 = ref(true)

// Form Data
const recipient = ref('')
const amount = ref('')
const securityKey = ref('')

// UI States
const showConfirmation = ref(false)
const showSuccess = ref(false)
const showQRScanner = ref(false)
const isProcessing = ref(false)
const showSuggestions = ref(false)

// Validation Errors
const recipientError = ref(false)
const amountError = ref(false)

// Quick amounts for easy selection
const quickAmounts = ref(['100', '1000', '5000', '10000', '50000'])

// VIP Levels Data
const vipLevels = ref([
  { level: 1, limit: '10.00', benefit: 'Basic Transfer Access' },
  { level: 2, limit: '100.00', benefit: 'Extended Daily Limit' },
  { level: 3, limit: '30,000.00', benefit: 'Priority Processing' },
  { level: 4, limit: '100,000.00', benefit: 'Reduced Fees' },
  { level: 5, limit: '200,000.00', benefit: 'Instant Transfers' },
  { level: 6, limit: '2,000,000.00', benefit: 'Keyless Transfers' },
])

// Sample recipient suggestions
const recipientSuggestions = ref([
  { id: 1, name: 'John Crypto', account: '@john_crypto', vipLevel: 5, limit: '200K' },
  { id: 2, name: 'Alice Trader', account: '@alice_trades', vipLevel: 4, limit: '100K' },
  { id: 3, name: 'Mike Investor', account: '@mike_invest', vipLevel: 6, limit: '2M' },
  { id: 4, name: 'Sarah Exchange', account: '@sarah_ex', vipLevel: 3, limit: '30K' },
])

// Computed Properties
const formattedBalance = computed(() => {
  return (
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
      .format(balance.value)
      .replace('$', '') + ' USDT'
  )
})

const transferFee = computed(() => {
  const amt = parseFloat(amount.value) || 0
  if (amt <= 1000) return 0.1
  if (amt <= 10000) return 0.5
  if (amt <= 100000) return 2
  if (amt <= 1000000) return 10
  return 50
})

const totalWithFee = computed(() => {
  const amt = parseFloat(amount.value) || 0
  return (amt + transferFee.value).toFixed(2)
})

const canTransfer = computed(() => {
  const amt = parseFloat(amount.value) || 0
  const hasRecipient = recipient.value.trim().length > 0
  const hasAmount = amt > 0
  const hasBalance = amt <= balance.value
  const hasSecurity = isVIP6.value || securityKey.value.length >= 6

  return hasRecipient && hasAmount && hasBalance && hasSecurity
})

// Methods
const selectRecipient = (suggestion) => {
  recipient.value = suggestion.account
  showSuggestions.value = false
}

const getVIPColorClass = (level) => {
  const colors = {
    1: 'bg-gray-500/20 text-gray-300',
    2: 'bg-blue-500/20 text-blue-300',
    3: 'bg-green-500/20 text-green-300',
    4: 'bg-purple-500/20 text-purple-300',
    5: 'bg-yellow-500/20 text-yellow-300',
    6: 'bg-gradient-to-br from-cyan-500 to-purple-500 text-white',
  }
  return colors[level] || colors[1]
}

const initiateTransfer = () => {
  if (!canTransfer.value) return

  // Validate amount
  const amt = parseFloat(amount.value)
  if (amt > balance.value) {
    amountError.value = true
    return
  }

  // Validate recipient (simple check)
  if (!recipient.value.includes('@')) {
    recipientError.value = true
    return
  }

  amountError.value = false
  recipientError.value = false
  showConfirmation.value = true
}

const processTransfer = async () => {
  showConfirmation.value = false
  isProcessing.value = true

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000))

  isProcessing.value = false
  showSuccess.value = true

  // Update balance
  balance.value -= parseFloat(amount.value)
  dailyTransfers.value += parseFloat(amount.value)
}

const resetForm = () => {
  amount.value = ''
  securityKey.value = ''
  showSuccess.value = false
}

const scanQR = () => {
  showQRScanner.value = true
}

const showHistory = () => {
  alert('Transfer history would open here')
}

const addFavorite = () => {
  if (recipient.value) {
    alert(`Added ${recipient.value} to favorites`)
  } else {
    alert('Please enter a recipient first')
  }
}

// Watchers
watch(recipient, (newValue) => {
  showSuggestions.value = newValue.length > 0
  recipientError.value = false
})

watch(amount, (newValue) => {
  const amt = parseFloat(newValue) || 0
  if (amt > 0 && amt <= balance.value) {
    amountError.value = false
  }
})

// Format amount input
watch(
  () => amount.value,
  (newValue) => {
    if (newValue) {
      amount.value = parseFloat(newValue).toFixed(2)
    }
  },
)
</script>

<style scoped>
/* Custom animations */
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

/* Hide number input arrows */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #00e0ff, #0080ff);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #00e0ff, #0080ff);
}
</style>

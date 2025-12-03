<template>
  <div
    class="app-container min-h-screen bg-gradient-to-br from-[#0a0f24] via-[#121830] to-[#1a1f3d] text-white"
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
        class="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"
      ></div>
    </div>

    <!-- Header with Back Button -->
    <header class="relative z-10 pt-6 px-4">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <button @click="goBack" class="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <i class="fas fa-arrow-left text-xl"></i>
          </button>
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"
            >
              <span class="text-xl font-bold">W</span>
            </div>
            <div>
              <div class="text-sm opacity-80">Internal Transfer</div>
              <div class="text-lg font-bold">Send & Receive Funds</div>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div class="text-right">
            <div class="text-sm opacity-70">Available Balance</div>
            <div class="text-xl font-bold text-green-400">
              {{ formatCurrency(userBalance) }} USDT
            </div>
          </div>
          <button @click="showHelp" class="p-2 hover:bg-white/10 rounded-xl">
            <i class="fas fa-question-circle text-xl"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="relative z-10 px-4 pb-24">
      <!-- Balance Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Total Balance -->
        <div
          class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-green-500/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-70">Total Balance</div>
              <div class="text-2xl font-bold text-green-400">
                {{ formatCurrency(totalBalance) }} USDT
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="fas fa-wallet text-xl text-green-400"></i>
            </div>
          </div>
          <div class="mt-3 text-xs opacity-70">Across all accounts</div>
        </div>

        <!-- Available Balance -->
        <div
          class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-70">Available Now</div>
              <div class="text-2xl font-bold text-cyan-400">
                {{ formatCurrency(userBalance) }} USDT
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <i class="fas fa-coins text-xl text-cyan-400"></i>
            </div>
          </div>
          <div class="mt-3 text-xs opacity-70">Ready for transfer</div>
        </div>

        <!-- Locked Balance -->
        <div
          class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-70">Locked in Investments</div>
              <div class="text-2xl font-bold text-purple-400">
                {{ formatCurrency(lockedBalance) }} USDT
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="fas fa-lock text-xl text-purple-400"></i>
            </div>
          </div>
          <div class="mt-3 text-xs opacity-70">Active investments</div>
        </div>
      </div>

      <!-- Transfer Interface -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Transfer Form -->
        <div class="lg:col-span-2">
          <div
            class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <h3 class="text-xl font-bold mb-6">Transfer Funds</h3>

            <!-- Transfer Type Selection -->
            <div class="flex space-x-2 mb-6">
              <button
                v-for="type in transferTypes"
                :key="type.id"
                @click="transferType = type.id"
                :class="[
                  'flex-1 py-3 rounded-xl font-semibold transition-all duration-300',
                  transferType === type.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/5 text-white/70 hover:bg-white/10',
                ]"
              >
                <div class="flex items-center justify-center space-x-2">
                  <i :class="type.icon"></i>
                  <span>{{ type.label }}</span>
                </div>
              </button>
            </div>

            <!-- Transfer Form -->
            <div class="space-y-4">
              <!-- Recipient Selection -->
              <div>
                <label class="text-sm opacity-70 mb-2 block">Recipient</label>
                <div class="relative">
                  <input
                    v-model="recipient"
                    type="text"
                    class="w-full pl-12 pr-4 py-3 bg-black/40 border border-cyan-500/30 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter recipient username or email"
                  />
                  <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i class="fas fa-user text-cyan-400"></i>
                  </div>
                  <button
                    v-if="suggestedRecipients.length > 0"
                    @click="showRecipientSuggestions = !showRecipientSuggestions"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400"
                  >
                    <i class="fas fa-chevron-down"></i>
                  </button>
                </div>

                <!-- Recipient Suggestions -->
                <div
                  v-if="showRecipientSuggestions && suggestedRecipients.length > 0"
                  class="mt-2 bg-black/60 rounded-xl p-2 space-y-1"
                >
                  <div
                    v-for="suggestion in suggestedRecipients"
                    :key="suggestion.id"
                    @click="selectRecipient(suggestion)"
                    class="p-2 rounded-lg hover:bg-white/10 cursor-pointer flex items-center justify-between"
                  >
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center"
                      >
                        <i class="fas fa-user text-sm"></i>
                      </div>
                      <div>
                        <div class="font-medium">{{ suggestion.name }}</div>
                        <div class="text-xs opacity-70">{{ suggestion.email }}</div>
                      </div>
                    </div>
                    <div class="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                      Verified
                    </div>
                  </div>
                </div>
              </div>

              <!-- Amount Input -->
              <div>
                <label class="text-sm opacity-70 mb-2 block">Amount (USDT)</label>
                <div class="relative">
                  <input
                    v-model="transferAmount"
                    type="number"
                    :min="minTransferAmount"
                    :max="userBalance"
                    step="0.01"
                    class="w-full pl-12 pr-4 py-3 bg-black/40 border border-cyan-500/30 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="0.00"
                    @input="validateAmount"
                  />
                  <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i class="fas fa-money-bill-wave text-cyan-400"></i>
                  </div>
                  <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm">
                    USDT
                  </div>
                </div>
                <div class="flex justify-between text-xs opacity-70 mt-1">
                  <span>Min: {{ formatCurrency(minTransferAmount) }} USDT</span>
                  <span>Available: {{ formatCurrency(userBalance) }} USDT</span>
                </div>
              </div>

              <!-- Quick Amount Buttons -->
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="percent in quickPercentages"
                  :key="percent"
                  @click="setAmountPercentage(percent)"
                  class="py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {{ percent }}%
                </button>
              </div>

              <!-- Transfer Notes -->
              <div>
                <label class="text-sm opacity-70 mb-2 block">Notes (Optional)</label>
                <textarea
                  v-model="transferNotes"
                  class="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-xl text-white focus:border-cyan-500 focus:outline-none resize-none"
                  rows="2"
                  placeholder="Add a message to recipient..."
                ></textarea>
              </div>

              <!-- Fee Information -->
              <div class="bg-black/30 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="opacity-70">Transfer Fee</span>
                  <span class="font-bold text-green-400"
                    >{{ formatCurrency(calculateFee()) }} USDT</span
                  >
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="opacity-70">You'll Receive</span>
                  <span class="font-bold text-cyan-400"
                    >{{ formatCurrency(calculateNetAmount()) }} USDT</span
                  >
                </div>
                <div class="mt-2 text-xs opacity-70">
                  <i class="fas fa-info-circle mr-1"></i>
                  VIP members enjoy zero transfer fees
                </div>
              </div>

              <!-- Transfer Button -->
              <button
                @click="initiateTransfer"
                :disabled="!isTransferValid"
                :class="[
                  'w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 mt-4',
                  isTransferValid
                    ? 'bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/30'
                    : 'bg-white/10 cursor-not-allowed opacity-50',
                ]"
              >
                <div class="flex items-center justify-center space-x-2">
                  <i class="fas fa-paper-plane"></i>
                  <span>Send Transfer</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Transfer Details & Features -->
        <div class="space-y-6">
          <!-- Transfer Limits -->
          <div
            class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
          >
            <h4 class="font-bold mb-4">Transfer Limits</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm opacity-70">Daily Limit</span>
                <span class="font-bold">{{ formatCurrency(dailyLimit) }} USDT</span>
              </div>
              <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                  :style="{ width: dailyUsedPercentage + '%' }"
                ></div>
              </div>
              <div class="flex justify-between text-xs opacity-70">
                <span>Used: {{ formatCurrency(dailyUsed) }}</span>
                <span>Remaining: {{ formatCurrency(dailyRemaining) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm opacity-70">Monthly Limit</span>
                <span class="font-bold">{{ formatCurrency(monthlyLimit) }} USDT</span>
              </div>
              <div class="text-xs opacity-70 mt-2">
                <i class="fas fa-crown mr-1 text-yellow-400"></i>
                Upgrade to VIP for higher limits
              </div>
            </div>
          </div>

          <!-- Transfer Speed -->
          <div
            class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
          >
            <h4 class="font-bold mb-4">Transfer Speed</h4>
            <div class="space-y-3">
              <div
                class="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20"
              >
                <div class="flex items-center space-x-2">
                  <i class="fas fa-bolt text-green-400"></i>
                  <span>Instant Transfer</span>
                </div>
                <span class="text-sm text-green-400">FREE</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
              >
                <div class="flex items-center space-x-2">
                  <i class="fas fa-rocket text-cyan-400"></i>
                  <span>Priority Transfer</span>
                </div>
                <span class="text-sm text-cyan-400">0.1% fee</span>
              </div>
              <div class="text-xs opacity-70">
                <i class="fas fa-shield-alt mr-1 text-purple-400"></i>
                All transfers are secured with bank-level encryption
              </div>
            </div>
          </div>

          <!-- QR Code for Receiving -->
          <div
            class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
          >
            <h4 class="font-bold mb-4">Receive Funds</h4>
            <div class="text-center">
              <div class="w-40 h-40 mx-auto bg-white p-4 rounded-xl mb-3">
                <!-- QR Code Placeholder -->
                <div
                  class="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-qrcode text-4xl text-white"></i>
                </div>
              </div>
              <div class="text-sm opacity-70 mb-2">Scan to receive funds</div>
              <div class="font-mono text-sm bg-black/30 p-2 rounded-lg mb-3">
                {{ userWalletAddress }}
              </div>
              <button
                @click="copyWalletAddress"
                class="w-full py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                <div class="flex items-center justify-center space-x-2">
                  <i class="fas fa-copy"></i>
                  <span>Copy Address</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transfers -->
      <div
        class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/10 mb-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">Recent Transfers</h3>
          <button @click="viewAllTransfers" class="text-sm text-cyan-400 hover:text-cyan-300">
            View All <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>

        <!-- Transfers List -->
        <div class="space-y-3 max-h-80 overflow-y-auto pr-2">
          <div
            v-for="transfer in recentTransfers"
            :key="transfer.id"
            @click="viewTransferDetails(transfer)"
            class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="{
                    'bg-green-500/20': transfer.type === 'sent',
                    'bg-cyan-500/20': transfer.type === 'received',
                  }"
                >
                  <i
                    :class="transfer.type === 'sent' ? 'fas fa-paper-plane' : 'fas fa-download'"
                    :class="{
                      'text-green-400': transfer.type === 'sent',
                      'text-cyan-400': transfer.type === 'received',
                    }"
                  ></i>
                </div>
                <div>
                  <div class="font-medium">
                    {{
                      transfer.type === 'sent'
                        ? 'Sent to ' + transfer.to
                        : 'Received from ' + transfer.from
                    }}
                  </div>
                  <div class="text-xs opacity-70">
                    {{ formatDate(transfer.date) }} • {{ transfer.time }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div
                  class="font-bold"
                  :class="{
                    'text-red-400': transfer.type === 'sent',
                    'text-green-400': transfer.type === 'received',
                  }"
                >
                  {{ transfer.type === 'sent' ? '-' : '+'
                  }}{{ formatCurrency(transfer.amount) }} USDT
                </div>
                <div class="text-xs opacity-70">{{ transfer.status }}</div>
              </div>
            </div>
            <div v-if="transfer.notes" class="mt-2 text-sm opacity-80">"{{ transfer.notes }}"</div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="mt-4 pt-4 border-t border-white/10">
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-sm opacity-70">Today</div>
              <div class="text-lg font-bold text-green-400">
                {{ formatCurrency(todayStats.sent + todayStats.received) }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-sm opacity-70">This Week</div>
              <div class="text-lg font-bold text-cyan-400">
                {{ formatCurrency(weekStats.sent + weekStats.received) }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-sm opacity-70">Success Rate</div>
              <div class="text-lg font-bold text-purple-400">{{ successRate }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Premium Features -->
      <div
        class="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30 mb-24"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold">Premium Transfer Features</h3>
            <div class="text-sm opacity-70">Upgrade for exclusive benefits</div>
          </div>
          <button
            @click="upgradeToPremium"
            class="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-semibold hover:opacity-90"
          >
            <i class="fas fa-crown mr-2"></i>
            Upgrade Now
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="p-4 bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-xl border border-green-500/30"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center"
              >
                <i class="fas fa-bolt text-white"></i>
              </div>
              <div>
                <div class="font-bold">Zero Fees</div>
                <div class="text-xs opacity-70">Unlimited free transfers</div>
              </div>
            </div>
          </div>

          <div
            class="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              >
                <i class="fas fa-shield-alt text-white"></i>
              </div>
              <div>
                <div class="font-bold">Priority Support</div>
                <div class="text-xs opacity-70">24/7 dedicated support</div>
              </div>
            </div>
          </div>

          <div
            class="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30"
          >
            <div class="flex items-center space-x-3 mb-2">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center"
              >
                <i class="fas fa-chart-line text-white"></i>
              </div>
              <div>
                <div class="font-bold">Higher Limits</div>
                <div class="text-xs opacity-70">Up to $500K per transfer</div>
              </div>
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
            v-for="nav in navigation"
            :key="nav.id"
            @click="navigateTo(nav.id)"
            :class="[
              'flex flex-col items-center p-3 rounded-xl transition-all duration-300',
              activeNav === nav.id
                ? 'bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-300'
                : 'text-white/70 hover:text-white hover:bg-white/5',
            ]"
          >
            <i :class="['text-xl mb-1', nav.icon]"></i>
            <span class="text-xs font-medium">{{ nav.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Transfer Confirmation Modal -->
    <div
      v-if="showTransferModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        class="bg-gradient-to-br from-gray-900 to-black rounded-2xl w-full max-w-md border border-cyan-500/30 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">Confirm Transfer</h3>
            <button @click="showTransferModal = false" class="p-2 hover:bg-white/10 rounded-lg">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <!-- Transfer Summary -->
            <div
              class="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl border border-green-500/30"
            >
              <div class="text-center">
                <div class="text-2xl font-bold text-green-400 mb-1">
                  {{ formatCurrency(transferAmount) }} USDT
                </div>
                <div class="text-sm opacity-70">Sending to {{ recipient }}</div>
              </div>
            </div>

            <!-- Transfer Details -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="opacity-70">Recipient</span>
                <span class="font-bold">{{ recipient }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">Amount</span>
                <span class="font-bold">{{ formatCurrency(transferAmount) }} USDT</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">Transfer Fee</span>
                <span class="opacity-70">{{ formatCurrency(calculateFee()) }} USDT</span>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-white/10">
                <span class="opacity-70">Total Deducted</span>
                <span class="font-bold text-red-400"
                  >{{ formatCurrency(calculateTotalDeduction()) }} USDT</span
                >
              </div>
            </div>

            <!-- Notes -->
            <div v-if="transferNotes" class="p-3 bg-black/30 rounded-lg">
              <div class="text-sm opacity-70 mb-1">Note to recipient:</div>
              <div class="text-sm opacity-90">"{{ transferNotes }}"</div>
            </div>
          </div>

          <div class="mt-6 flex space-x-3">
            <button
              @click="showTransferModal = false"
              class="flex-1 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmTransfer"
              class="flex-1 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Confirm & Send
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
              <i class="fas fa-check text-4xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">Transfer Successful!</h3>
            <p class="opacity-80 mb-6">
              {{ formatCurrency(transferAmount) }} USDT sent to {{ recipient }}
            </p>

            <div class="space-y-3 mb-6">
              <div class="flex items-center justify-between">
                <span class="opacity-70">Transaction ID</span>
                <span class="font-mono text-sm">{{ transactionId }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">Time</span>
                <span class="font-bold">{{ new Date().toLocaleTimeString() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="opacity-70">New Balance</span>
                <span class="font-bold text-green-400">{{ formatCurrency(newBalance) }} USDT</span>
              </div>
            </div>

            <button
              @click="showSuccessModal = false"
              class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold"
            >
              Done
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
const activeNav = ref('wallet')
const transferType = ref('internal') // internal, external, request
const recipient = ref('')
const transferAmount = ref('')
const transferNotes = ref('')
const showRecipientSuggestions = ref(false)
const showTransferModal = ref(false)
const showSuccessModal = ref(false)

// User Data (would come from API/store in real app)
const userBalance = ref(0) // Will be loaded from localStorage/API
const totalBalance = ref(0)
const lockedBalance = ref(0)
const userWalletAddress = ref('0x742d35Cc6634C0532925a3b844Bc9e...')

// Transfer Limits
const dailyLimit = ref(20000)
const monthlyLimit = ref(500000)
const dailyUsed = ref(0)
const dailyRemaining = computed(() => dailyLimit.value - dailyUsed.value)
const dailyUsedPercentage = computed(() => (dailyUsed.value / dailyLimit.value) * 100)
const minTransferAmount = ref(10)

// Quick Amount Percentages
const quickPercentages = ref([25, 50, 75, 100])

// Data
const transferTypes = ref([
  { id: 'internal', label: 'Internal', icon: 'fas fa-users' },
  { id: 'external', label: 'External', icon: 'fas fa-external-link-alt' },
  { id: 'request', label: 'Request', icon: 'fas fa-hand-holding-usd' },
])

const suggestedRecipients = ref([
  { id: 1, name: 'john_doe', email: 'john@example.com' },
  { id: 2, name: 'jane_smith', email: 'jane@example.com' },
  { id: 3, name: 'alex_wong', email: 'alex@example.com' },
])

const recentTransfers = ref([
  {
    id: 1,
    type: 'sent',
    to: 'john_doe',
    amount: 500,
    date: '2025-11-28',
    time: '14:30',
    status: 'Completed',
    notes: 'For lunch',
  },
  {
    id: 2,
    type: 'received',
    from: 'jane_smith',
    amount: 1000,
    date: '2025-11-28',
    time: '12:15',
    status: 'Completed',
    notes: 'Investment return',
  },
  {
    id: 3,
    type: 'sent',
    to: 'alex_wong',
    amount: 250,
    date: '2025-11-27',
    time: '16:45',
    status: 'Completed',
    notes: '',
  },
])

const navigation = ref([
  { id: 'home', label: 'Home', icon: 'fas fa-home' },
  { id: 'trade', label: 'Trade', icon: 'fas fa-chart-line' },
  { id: 'invest', label: 'Invest', icon: 'fas fa-coins' },
  { id: 'wallet', label: 'Wallet', icon: 'fas fa-wallet' },
  { id: 'account', label: 'Account', icon: 'fas fa-user' },
])

// Computed
const isTransferValid = computed(() => {
  return (
    recipient.value.trim() !== '' &&
    parseFloat(transferAmount.value) >= minTransferAmount.value &&
    parseFloat(transferAmount.value) <= userBalance.value &&
    transferAmount.value !== ''
  )
})

const todayStats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayTransfers = recentTransfers.value.filter((t) => t.date === today)

  return {
    sent: todayTransfers.filter((t) => t.type === 'sent').reduce((sum, t) => sum + t.amount, 0),
    received: todayTransfers
      .filter((t) => t.type === 'received')
      .reduce((sum, t) => sum + t.amount, 0),
  }
})

const weekStats = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekTransfers = recentTransfers.value.filter((t) => new Date(t.date) >= weekAgo)

  return {
    sent: weekTransfers.filter((t) => t.type === 'sent').reduce((sum, t) => sum + t.amount, 0),
    received: weekTransfers
      .filter((t) => t.type === 'received')
      .reduce((sum, t) => sum + t.amount, 0),
  }
})

const successRate = computed(() => {
  const total = recentTransfers.value.length
  const completed = recentTransfers.value.filter((t) => t.status === 'Completed').length
  return total > 0 ? Math.round((completed / total) * 100) : 100
})

const transactionId = computed(() => {
  return (
    'TX' +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substr(2, 5).toUpperCase()
  )
})

const newBalance = computed(() => {
  return userBalance.value - parseFloat(transferAmount.value || 0)
})

// Methods
const goBack = () => {
  router.push('/')
}

const loadUserData = () => {
  // Load user balance from localStorage or API
  const savedBalance = localStorage.getItem('userBalance')
  const savedTotal = localStorage.getItem('totalBalance')
  const savedLocked = localStorage.getItem('lockedBalance')

  userBalance.value = savedBalance ? parseFloat(savedBalance) : 0
  totalBalance.value = savedTotal ? parseFloat(savedTotal) : userBalance.value
  lockedBalance.value = savedLocked ? parseFloat(savedLocked) : 0

  // If no data exists, set defaults
  if (!savedBalance) {
    localStorage.setItem('userBalance', '0')
    localStorage.setItem('totalBalance', '0')
    localStorage.setItem('lockedBalance', '0')
  }
}

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') amount = parseFloat(amount) || 0
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const selectRecipient = (suggestion) => {
  recipient.value = suggestion.name
  showRecipientSuggestions.value = false
}

const setAmountPercentage = (percent) => {
  const amount = (userBalance.value * percent) / 100
  transferAmount.value = Math.max(
    minTransferAmount.value,
    Math.min(amount, userBalance.value),
  ).toFixed(2)
}

const validateAmount = () => {
  const amount = parseFloat(transferAmount.value)
  if (amount > userBalance.value) {
    transferAmount.value = userBalance.value.toFixed(2)
  }
  if (amount < minTransferAmount.value) {
    transferAmount.value = minTransferAmount.value.toFixed(2)
  }
}

const calculateFee = () => {
  const amount = parseFloat(transferAmount.value) || 0
  // VIP members get zero fees (in real app, check user tier)
  const isVIP = false // This would come from user data
  return isVIP ? 0 : amount * 0.001 // 0.1% fee for non-VIP
}

const calculateNetAmount = () => {
  const amount = parseFloat(transferAmount.value) || 0
  return amount - calculateFee()
}

const calculateTotalDeduction = () => {
  const amount = parseFloat(transferAmount.value) || 0
  return amount
}

const initiateTransfer = () => {
  if (!isTransferValid.value) {
    alert('Please fill in all required fields correctly')
    return
  }
  showTransferModal.value = true
}

const confirmTransfer = () => {
  showTransferModal.value = false

  // Update user balance
  const amount = parseFloat(transferAmount.value)
  const newUserBalance = userBalance.value - amount
  userBalance.value = newUserBalance
  localStorage.setItem('userBalance', newUserBalance.toString())

  // Update daily used
  dailyUsed.value += amount
  if (dailyUsed.value > dailyLimit.value) {
    dailyUsed.value = dailyLimit.value
  }

  // Add to recent transfers
  const now = new Date()
  recentTransfers.value.unshift({
    id: recentTransfers.value.length + 1,
    type: 'sent',
    to: recipient.value,
    amount: amount,
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Completed',
    notes: transferNotes.value,
  })

  // Show success modal
  setTimeout(() => {
    showSuccessModal.value = true
  }, 500)

  // Reset form
  resetForm()
}

const resetForm = () => {
  recipient.value = ''
  transferAmount.value = ''
  transferNotes.value = ''
}

const copyWalletAddress = () => {
  navigator.clipboard
    .writeText(userWalletAddress.value)
    .then(() => {
      alert('Wallet address copied to clipboard!')
    })
    .catch((err) => {
      console.error('Failed to copy: ', err)
    })
}

const viewTransferDetails = (transfer) => {
  alert(
    `Transfer Details:\nType: ${transfer.type}\nAmount: ${formatCurrency(transfer.amount)} USDT\nStatus: ${transfer.status}`,
  )
}

const viewAllTransfers = () => {
  alert('View all transfers modal would open')
}

const showHelp = () => {
  alert('Help center modal would open')
}

const upgradeToPremium = () => {
  alert('Upgrade to premium modal would open')
}

const navigateTo = (navId) => {
  activeNav.value = navId
  if (navId === 'home') {
    router.push('/')
  }
}

// Initialize
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
/* Fixed container for scrolling */
.app-container {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

/* Main content area */
.main-content {
  padding-bottom: 120px; /* Space for bottom nav */
}

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

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom scrollbar */
.app-container::-webkit-scrollbar {
  width: 6px;
}

.app-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.app-container::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #00e0ff, #0080ff);
  border-radius: 3px;
}

.app-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #00e0ff, #0080ff);
}

/* Input focus styles */
input:focus,
textarea:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
}

/* Disabled button styles */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Transfers list scrollbar */
.max-h-80::-webkit-scrollbar {
  width: 4px;
}

.max-h-80::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.max-h-80::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #00e0ff, #0080ff);
  border-radius: 2px;
}

.max-h-80::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #00e0ff, #0080ff);
}

/* Fix for transfer button overlapping */
.lg\\:col-span-2 {
  margin-bottom: 1rem;
}

/* Ensure proper spacing between form elements */
.space-y-4 > * + * {
  margin-top: 1rem;
}

/* Bottom navigation fixed position */
.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .pb-24 {
    padding-bottom: 140px;
  }
}

@media (max-width: 480px) {
  header {
    padding: 15px 10px;
  }

  .px-4 {
    padding-left: 10px;
    padding-right: 10px;
  }

  .pb-24 {
    padding-bottom: 160px;
  }
}
</style>

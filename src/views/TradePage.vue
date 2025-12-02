<template>
  <div class="min-h-screen flex flex-col bg-[#0a0f24] text-white">
    <!-- TOP CARD -->
    <div class="p-4">
      <div class="rounded-xl p-5 shadow-lg" :class="rainbowCard">
        <div class="flex justify-between items-start text-white">
          <div>
            <p class="text-lg font-medium">Hi, ksc22992</p>
            <p class="mt-2 text-3xl font-bold">6,838,616.47 USDT</p>

            <p class="mt-2 text-sm text-white/80">
              Daily Receiving Limit <span class="font-bold">2,000,000.00 USDT</span>
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs opacity-90">VIP6</p>
            <p class="mt-3 text-sm">Monthly Receiving Limit</p>
            <p class="font-bold">60,000,000.00 USDT</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ACTION MENU -->
    <div class="mx-4 bg-[#11182f] rounded-xl py-4 grid grid-cols-4 text-center shadow-md">
      <div class="flex flex-col items-center">
        <span class="text-2xl mb-1">💰</span>
        <p>Deposit</p>
      </div>

      <div class="flex flex-col items-center">
        <span class="text-2xl mb-1">🏧</span>
        <p>Withdraw</p>
      </div>

      <div class="flex flex-col items-center">
        <span class="text-2xl mb-1">🔁</span>
        <p>Internal Transfer</p>
      </div>

      <div class="flex flex-col items-center">
        <span class="text-2xl mb-1">💎</span>
        <p>Membership Upgrade</p>
      </div>
    </div>

    <!-- INVESTMENT BOX -->
    <div class="p-4">
      <div class="bg-[#11182f] rounded-xl p-5 shadow-md">
        <p class="text-3xl font-bold text-green-400">1.00%</p>
        <p class="opacity-80 text-sm">Annual Yield Reference</p>

        <div class="flex justify-end mt-2">
          <p class="text-right opacity-90">
            <span class="font-bold">7 Day</span><br />
            Investment Period
          </p>
        </div>

        <!-- DURATION OPTIONS -->
        <div class="flex gap-3 mt-5">
          <button
            v-for="day in [7, 14, 30, 60, 90]"
            :key="day"
            class="px-4 py-2 rounded-lg text-lg font-medium"
            :class="day === 7 ? rainbowButton : 'bg-[#0d1328] text-white/80'"
          >
            {{ day }}
          </button>
        </div>

        <p class="mt-6 text-sm opacity-80">Minimum Investment:</p>
        <p class="font-bold">5000 USDT</p>

        <!-- PARTICIPATE BTN -->
        <button class="w-full mt-7 py-3 rounded-xl text-lg font-bold" :class="rainbowButton">
          Participate Now
        </button>
      </div>
    </div>

    <!-- PLATFORM RECORD -->
    <div class="p-4">
      <p class="font-bold mb-2">📊 Platform Record</p>

      <div class="max-h-40 overflow-y-auto text-sm space-y-2 opacity-80">
        <div v-for="(record, index) in sampleRecords" :key="index">
          {{ record }}
        </div>
      </div>
    </div>

    <!-- BOTTOM NAV BAR -->
    <div class="mt-auto bg-[#11182f] flex justify-around py-3 text-sm sticky bottom-0">
      <div class="flex flex-col items-center opacity-70">
        <span>🏠</span>
        <p>Home</p>
      </div>

      <div class="flex flex-col items-center font-bold text-white">
        <span>📈</span>
        <p>Trade</p>
      </div>

      <div class="flex flex-col items-center opacity-70">
        <span>💸</span>
        <p>Transfer</p>
      </div>

      <div class="flex flex-col items-center opacity-70">
        <span>👤</span>
        <p>My Account</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const sampleRecords = [
  '3599 USDT - 2025-11-28',
  '4988 USDT - 2025-11-28',
  '2722 USDT - 2025-11-28',
  '3607 USDT - 2025-11-28',
  '2077 USDT - 2025-11-28',
]

// Rainbow gradient classes
const rainbowCard =
  'bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-500'

const rainbowButton =
  'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 text-white shadow-lg'
</script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 5px;
}
</style>

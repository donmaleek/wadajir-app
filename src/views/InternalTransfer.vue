<template>
  <div class="min-h-screen bg-[#0b0f2a] text-white px-4 py-6">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-sm tracking-widest opacity-80">Internal Transfer</h1>
    </div>

    <!-- Transfer Box -->
    <div class="rounded-2xl p-5 shadow-xl space-y-5 mb-10" :class="rainbowBox">
      <div>
        <p class="text-sm opacity-70">Balance</p>
        <p class="text-lg font-semibold">{{ balance }} tether(USDT)</p>
      </div>

      <div>
        <p class="text-sm opacity-70">Account</p>
        <input
          type="text"
          placeholder="Recipient Must Be At Least Vip1"
          class="w-full rounded-lg px-3 py-2 bg-black/20 mt-1 text-white placeholder-gray-300 focus:outline-none"
          v-model="recipient"
        />
      </div>

      <div>
        <p class="text-sm opacity-70">Quantity</p>
        <input
          type="number"
          placeholder="Please Enter Transfer Amount"
          class="w-full rounded-lg px-3 py-2 bg-black/20 mt-1 text-white placeholder-gray-300 focus:outline-none"
          v-model="amount"
        />
      </div>
    </div>

    <!-- Transfer Button -->
    <div class="flex justify-center mb-10">
      <button
        class="w-64 py-3 rounded-full text-black font-semibold shadow-md"
        :class="rainbowButton"
        @click="transfer"
      >
        Internal Transfer
      </button>
    </div>

    <!-- VIP Info -->
    <p class="text-red-400 text-sm mb-3">VIP Members Can Use One-click Transfer Without Key</p>

    <p class="text-lg font-semibold mb-4">Transfer and receiving limit (days)</p>

    <div class="space-y-2 text-gray-300 text-sm">
      <p>VIP1 (10.00 USDT)</p>
      <p>VIP2 (100.00 USDT)</p>
      <p>VIP3 (30000.00 USDT)</p>
      <p>VIP4 (100000.00 USDT)</p>
      <p>VIP5 (200000.00 USDT)</p>
      <p>VIP6 (2000000.00 USDT)</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const balance = ref('6838616.47')

const recipient = ref('')
const amount = ref('')

const transfer = () => {
  alert(`Transferring ${amount.value} USDT to ${recipient.value}`)
}

// rainbow gradient classes
const rainbowBox =
  'bg-gradient-to-r from-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 to-purple-500 bg-opacity-20'

const rainbowButton =
  'bg-gradient-to-r from-red-300 via-yellow-300 via-green-300 via-blue-300 to-purple-300'
</script>

<style>
/* Optional soft fade edges for gradient boxes */
</style>

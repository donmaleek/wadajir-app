<template>
  <div class="min-h-screen bg-[#0b0f2a] text-white pb-10">
    <!-- Header -->
    <div class="text-center py-5">
      <h1 class="text-sm tracking-widest opacity-80">Membership Upgrade</h1>
    </div>

    <!-- LEVELS -->
    <div class="space-y-8">
      <!-- MEMBERSHIP CARD -->
      <div
        v-for="(level, index) in membershipLevels"
        :key="index"
        class="relative mx-4 rounded-2xl p-6 shadow-xl overflow-hidden"
        :class="level.bg"
      >
        <!-- HOT Badge -->
        <div
          v-if="level.hot"
          class="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-0.5 rounded-full"
        >
          HOT
        </div>

        <!-- Diamond Icon -->
        <img :src="level.icon" class="absolute right-5 top-5 w-16 opacity-95" />

        <!-- Level Title -->
        <p class="text-6xl font-bold tracking-tight opacity-95">
          {{ level.title }}
        </p>

        <!-- Stats -->
        <div class="mt-6 space-y-1 text-sm opacity-90 leading-6">
          <p><strong>Deposit:</strong> {{ level.deposit }} USDT</p>
          <p><strong>Collection limit for money transfer service</strong></p>
          <p><strong>Daily Collection Limit:</strong> {{ level.daily }} USDT</p>
          <p><strong>Monthly Collection Limit:</strong> {{ level.monthly }} USDT</p>
        </div>

        <!-- Purchase Button -->
        <div class="w-full mt-7 flex justify-center">
          <button class="px-10 py-2 rounded-full font-medium bg-white text-black shadow-md">
            Purchase
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const membershipLevels = [
  {
    title: 'V7',
    deposit: '51.00',
    daily: '10.00',
    monthly: '50',
    icon: 'https://i.imgur.com/I5pM4wL.png',
    bg: 'bg-gradient-to-r from-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 to-purple-500',
  },

  {
    title: 'V2',
    deposit: '1498.5',
    daily: '100.00',
    monthly: '3000',
    icon: 'https://i.imgur.com/Z4x9h3L.png',
    bg: 'bg-gradient-to-r from-yellow-300 via-green-300 via-cyan-300 via-blue-400 to-purple-500',
  },

  {
    title: 'V3',
    deposit: '3001',
    daily: '30000.00',
    monthly: '900000',
    hot: true,
    icon: 'https://i.imgur.com/JyWqVnE.png',
    bg: 'bg-gradient-to-r from-pink-400 via-red-400 via-orange-400 via-yellow-400 to-lime-400',
  },

  {
    title: 'V4',
    deposit: '29998.5',
    daily: '100000.00',
    monthly: '3000000',
    icon: 'https://i.imgur.com/y4t2SpY.png',
    bg: 'bg-gradient-to-r from-yellow-400 via-amber-400 via-orange-500 to-red-500',
  },

  {
    title: 'V5',
    deposit: '30001',
    daily: '200000.00',
    monthly: '6000000',
    icon: 'https://i.imgur.com/BzVsfzA.png',
    bg: 'bg-gradient-to-r from-purple-400 via-pink-400 via-red-300 to-orange-400',
  },

  {
    title: 'V6',
    deposit: '99998.5',
    daily: '2000000.00',
    monthly: '60000000',
    icon: 'https://i.imgur.com/I5pM4wL.png',
    bg: 'bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 via-pink-500 to-red-500',
  },
]
</script>

<style scoped>
/* Smooth glossy gradient look */
div[class*='bg-gradient-to-r'] {
  background-size: 200% 200%;
  animation: gradientMove 8s ease infinite;
}

@keyframes gradientMove {
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
</style>

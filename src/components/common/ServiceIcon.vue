<template>
  <div class="service-icon-container">
    <div
      class="bg-blue-600 w-10 h-14 rounded-l-lg rounded-tr-lg rounded-br-3xl flex items-center justify-center shadow-lg relative cursor-pointer group hover:scale-105 transition-transform duration-300"
      @click="$emit('click')"
    >
      <span
        class="absolute -left-2 top-2 text-[10px] transform -rotate-90 origin-center text-white/80 font-bold tracking-tighter"
      >
        Service
      </span>
      <i
        class="fa-solid fa-headset text-white text-lg mb-1 ml-1 group-hover:scale-110 transition-transform"
      ></i>
      <div
        class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-blue-600 animate-pulse"
      ></div>

      <!-- Hover effect -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-lg rounded-tr-lg rounded-br-3xl"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.service-icon-container {
  position: relative;
}

/* Optional: Add a subtle glow effect on hover */
.group:hover .bg-blue-600 {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}
</style>

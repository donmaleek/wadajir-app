<template>
  <div class="flex justify-between items-center p-4 pt-6">
    <slot name="left">
      <Logo size="sm" @click="$emit('logo-click')" />
    </slot>

    <slot name="right">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center gap-2 opacity-80 cursor-pointer"
          @click="$emit('toggle-language')"
        >
          <span class="text-xs">{{ currentLanguage }}</span>
          <i class="fa-solid fa-globe text-xl text-green-400"></i>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup>
import Logo from '../common/Logo.vue'

defineProps({
  currentLanguage: {
    type: String,
    default: 'English',
  },
})

defineEmits(['logo-click', 'toggle-language'])
</script>

<script setup lang="ts">
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  disabled?: boolean
}

defineProps<ButtonProps>()
</script>

<template>
  <button
    :type="{ type }"
    :class="{ 'button--full-width': fullWidth }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

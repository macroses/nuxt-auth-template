<script setup lang="ts">
interface InputProps {
  label: string,
  id: string,
  type?: string,
  required?: boolean,
  modelValue: string | number,
  name: string,
  disabled?: boolean,
}

const props = defineProps<InputProps>()

defineEmits<{
  (e: 'update:modelValue', value: EventTarget): void
}>()

const value = defineModel<string | number>()
</script>

<template>
  <label>
    {{ props.label }}
    <input
      :id="props.id"
      :type="props.type || 'text'"
      :required="props.required"
      :name="props.name"
      :disabled="props.disabled"
      v-model="value"
    />
  </label>
</template>

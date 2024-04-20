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
const emit = defineEmits('update:modelValue')
//
// const value = computed({
//   get () {
//     return props.modelValue
//   },
//   set (value) {
//     emit('update:modelValue', value)
//   }
// })

const value = defineModel({
  prop: 'modelValue',
  event: 'update:modelValue'
})
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
      @input="(e) => emit('update:modelValue', e.target.value)"
    />
  </label>
</template>

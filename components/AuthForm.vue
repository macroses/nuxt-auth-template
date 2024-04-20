<script setup lang="ts">
type VARIANT = 'LOGIN' | 'REGISTER'

const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

const { signIn } = useAuth()

const variant = ref<VARIANT>('LOGIN')

const authButtonText = computed(() => variant.value === 'LOGIN' ? 'Login' : 'Register')

const toggleVariant = () => {
  variant.value = variant.value === 'LOGIN' ? 'REGISTER' : 'LOGIN'
}

async function onSubmit() {
  if(variant.value === 'REGISTER') {
    try {
      isLoading.value = true

      const { user } = await $fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value
        }),
      })

      if (!user) {
        console.log('failed to register')
        return
      }
      if (user) {
        console.log('successfully register')
      }

      isLoading.value = false
    } catch (error: any) {
      console.error(error.message)
    } finally {
      isLoading.value = false
    }
  } else {
    try {
      isLoading.value = true

      const result = await signIn('credentials', {
        email: email.value,
        password: password.value,
        redirect: false
      }) as any

      console.log(result)

      if (result?.ok && !result.error) {
        console.log('successfully login')
        await navigateTo('/home')
      } else {
        error.value = result.error
        return
      }

      isLoading.value = false
    } catch (error: any) {
      console.error(error.message)
    } finally {
      isLoading.value = false
    }
  }
}

const socialAuth = async (action: string) => {
  isLoading.value = true;

  await signIn(action);
  navigateTo('/home')
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    {{ error }}
    <TheInput
      v-if="variant === 'REGISTER'"
      id="name"
      required
      label="name"
      name="name"
      v-model="name"
      type="text"
    />
    <TheInput
      id="email"
      required
      label="email"
      name="email"
      type="email"
      v-model="email"
    />

    <TheInput
      id="password"
      required
      label="password"
      type="password"
      name="password"
      v-model="password"
    />

    <TheButton button-type="submit">
      {{ authButtonText }}
    </TheButton>
    <p>or continue with</p>
    <TheButton @click="socialAuth('github')">
      github
    </TheButton>
    <TheButton @click="socialAuth('google')">
      google
    </TheButton>

    <div class="form-helper">
      <p @click="toggleVariant">
        {{ variant === 'REGISTER' ? 'Don’t have an account?' : 'Already have an account?' }}
      </p>
      <p class="link" @click="toggleVariant">
        {{ variant === 'LOGIN' ? 'create an account' : 'login' }}
      </p>
    </div>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.link {
  color: blue;
}
</style>
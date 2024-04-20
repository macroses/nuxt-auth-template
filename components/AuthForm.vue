<script setup lang="ts">

enum VARIANT {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const { signIn } = useAuth()

const variant = ref<VARIANT>('LOGIN')

const authButtonText = computed(() => variant.value === VARIANT.LOGIN ? 'Login' : 'Register')

const toggleVariant = () => {
  variant.value = variant.value === VARIANT.LOGIN ? VARIANT.REGISTER : VARIANT.LOGIN
}

async function onSubmit() {
  if(variant.value === VARIANT.REGISTER) {
    try {
      isLoading.value = true

      const { data, error } = await $fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value
        })
      })

      if (error) console.log(error)
      if (data) console.log('successfully register')

      isLoading.value = false
    } catch (error) {
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
        redirect: '/about'
      })

      if (result?.ok && !result.error) {
        console.log('successfully login')
      } else {
        console.log('failed to login')
      }

      if (error) console.log(error.value)
      if (data) console.log('successfully register')

      isLoading.value = false
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
}

const socialAuth = async (action: string) => {
  isLoading.value = true;

  await signIn(action, { redirect: false });
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    {{ name}}
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

    <TheButton type="submit">
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
        {{ variant === VARIANT.REGISTER ? 'Don’t have an account?' : 'Already have an account?' }}
      </p>
      <p class="link" @click="toggleVariant">
        {{ variant === VARIANT.LOGIN ? 'create an account' : 'login' }}
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
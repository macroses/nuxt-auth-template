<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})


const { signOut } = useAuth()

const handleSignOut = async () => {
  try {
    await signOut({ callbackUrl: '/'})
  } catch (error) {
    console.error(error.message)
  }
}
</script>

<template>
  <div class="container">
    <p>its home page</p>
    <button @click="handleSignOut">signOut</button>
  </div>

</template>

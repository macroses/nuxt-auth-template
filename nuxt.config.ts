// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@sidebase/nuxt-auth'],
  runtimeConfig: {
    authSecret: '',
    githubId: '',
    githubSecret: '',
    googleId: '',
    googleSecret: '',
    authOrigin: '',
    public: {

    }
  },
  typescript: {
    typeCheck: true
  }
})
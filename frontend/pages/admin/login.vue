<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// If already authenticated, redirect to admin
onMounted(() => {
  authStore.init()
  if (authStore.isAuthenticated) {
    navigateTo('/admin')
  }
})

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    navigateTo('/admin')
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Identifiants invalides'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface-dark flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-display font-bold text-white tracking-tight">{{ storeConfig.storeName }}</h1>
        <p class="text-sm text-gray-400 mt-1">Panneau d'administration</p>
      </div>

      <!-- Form card -->
      <div class="bg-surface-light rounded-xl p-6 border border-white/10">
        <h2 class="text-lg font-semibold text-white mb-6">Connexion</h2>

        <!-- Error -->
        <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-1.5">Identifiant</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              autocomplete="username"
              class="w-full px-3 py-2.5 bg-surface-darker border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              placeholder="admin"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1.5">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full px-3 py-2.5 bg-surface-darker border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              placeholder="••••••••"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Connexion en cours...</span>
            <span v-else>Connexion</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

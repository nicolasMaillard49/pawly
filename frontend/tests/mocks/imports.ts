export { ref, computed, onMounted, onUnmounted, watch, reactive } from 'vue'
export const useRuntimeConfig = () => ({
  public: { apiBase: 'http://localhost:3000/api', siteUrl: 'https://clipbag.shop' },
})
export const useSeoMeta = vi.fn()
export const useHead = vi.fn()
export const useRoute = () => ({ query: {} })
export const navigateTo = vi.fn()

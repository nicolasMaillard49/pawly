export const useApi = () => {
  const config = useRuntimeConfig()

  const apiFetch = async <T>(path: string, options?: any): Promise<T> => {
    return await $fetch<T>(`${config.public.apiBase}${path}`, options)
  }

  return { apiFetch }
}

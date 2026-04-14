export function useMetaPixel() {
  function track(event: string, params?: Record<string, unknown>) {
    if (import.meta.client && (window as any).fbq) {
      ;(window as any).fbq('track', event, params)
    }
  }

  return { track }
}

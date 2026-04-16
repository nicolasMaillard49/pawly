export const storeConfig = {
  storeName: process.env.STORE_NAME || 'MON STORE',
  storeUrl: process.env.STORE_URL || 'https://pawly.shopping',
  contactEmail: process.env.CONTACT_EMAIL || 'contact@pawly.shopping',
  orderPrefix: process.env.ORDER_PREFIX || 'MS',
  emailFrom: process.env.EMAIL_FROM || `${process.env.STORE_NAME || 'MON STORE'} <onboarding@resend.dev>`,
  adminDashboardUrl: `${process.env.STORE_URL || 'https://pawly.shopping'}/admin/orders`,
  trackingPageUrl: `${process.env.STORE_URL || 'https://pawly.shopping'}/suivi`,
}

export function formatOrderNumber(orderNumber: number): string {
  return `${storeConfig.orderPrefix}-${String(orderNumber).padStart(5, '0')}`
}

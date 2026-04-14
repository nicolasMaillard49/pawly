export function useOrderStatus() {
  const statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    PAID: 'Payee',
    PROCESSING: 'En traitement',
    SHIPPED: 'Expediee',
    DELIVERED: 'Livree',
    CANCELLED: 'Annulee',
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500/15 text-yellow-400',
    PAID: 'bg-green-500/15 text-green-400',
    PROCESSING: 'bg-blue-500/15 text-blue-400',
    SHIPPED: 'bg-purple-500/15 text-purple-400',
    DELIVERED: 'bg-emerald-500/15 text-emerald-400',
    CANCELLED: 'bg-red-500/15 text-red-400',
  }

  return { statusLabels, statusColors }
}

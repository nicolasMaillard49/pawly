<script setup lang="ts">
const config = useRuntimeConfig()
const productStore = useProductStore()
const siteUrl = config.public.siteUrl || 'https://clipbag.shop'

// Build absolute image URLs from product store (fallback to defaults)
const productImages = computed(() => {
  const images = productStore.product?.images || [
    '/images/product/product-1.png',
    '/images/product/product-2.png',
    '/images/product/product-3.png',
  ]
  return images.map((img: string) => img.startsWith('http') ? img : `${siteUrl}${img}`)
})

// JSON-LD structured data for SEO (Product schema)
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productStore.product?.name || 'ClipBag - Sac Magnétique pour Bouteille',
        description: productStore.product?.description || 'Le sac magnétique révolutionnaire pour vos bouteilles. Fixation instantanée, ultra léger (120g), compatible toutes bouteilles.',
        image: productImages.value.slice(0, 3),
        brand: { '@type': 'Brand', name: 'ClipBag' },
        offers: {
          '@type': 'Offer',
          url: siteUrl,
          priceCurrency: 'EUR',
          price: String(productStore.product?.price || '29.99'),
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'ClipBag' },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'EUR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'FR',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
              transitTime: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 20, unitCode: 'DAY' },
            },
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '2147',
          bestRating: '5',
          worstRating: '1',
        },
      })),
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

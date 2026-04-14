<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

const config = useRuntimeConfig()
const productStore = useProductStore()
const siteUrl = config.public.siteUrl || storeConfig.storeUrl

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
        name: productStore.product?.name || `${storeConfig.storeName} - ${storeConfig.product.tagline}`,
        description: productStore.product?.description || storeConfig.product.description,
        image: productImages.value.slice(0, 3),
        brand: { '@type': 'Brand', name: storeConfig.storeName },
        offers: {
          '@type': 'Offer',
          url: siteUrl,
          priceCurrency: storeConfig.product.currency,
          price: String(productStore.product?.price || storeConfig.product.defaultPrice),
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: storeConfig.storeName },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: storeConfig.product.currency,
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

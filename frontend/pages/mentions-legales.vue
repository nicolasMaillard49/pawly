<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || storeConfig.storeUrl
const siteDomain = storeConfig.storeUrl.replace('https://', '')

useSeoMeta({
  title: `Mentions Légales - ${storeConfig.storeName}`,
  description: `Mentions légales du site ${siteDomain} - Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.`,
  ogTitle: `Mentions Légales - ${storeConfig.storeName}`,
  ogDescription: `Mentions légales du site ${siteDomain}`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}${useRoute().path}` }],
})
</script>

<template>
  <div class="min-h-screen py-24 sm:py-32 px-4 sm:px-6">
    <div class="max-w-3xl mx-auto">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand transition-colors duration-200 mb-8 cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Retour à l'accueil
      </NuxtLink>

      <h1 class="font-display font-black text-3xl sm:text-4xl text-white mb-12">
        Mentions Légales
      </h1>

      <div class="prose-legal space-y-10 text-gray-300 leading-relaxed">
        <!-- Éditeur -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">1. Éditeur du site</h2>
          <p>
            Le site <strong class="text-white">{{ siteDomain }}</strong> est édité par :<br />
            <strong class="text-white">{{ storeConfig.legal.companyName }}</strong><br />
            Siège social : {{ storeConfig.legal.address }}<br />
            Directeur de la publication : {{ storeConfig.legal.director }}<br />
            Contact : <a :href="`mailto:${storeConfig.contactEmail}`" class="text-brand hover:text-brand-light transition-colors">{{ storeConfig.contactEmail }}</a>
          </p>
        </section>

        <!-- Hébergeur -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">2. Hébergeur</h2>
          <p>
            Le site est hébergé par :<br />
            {{ storeConfig.legal.host }}
          </p>
        </section>

        <!-- Propriété intellectuelle -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, sons, logiciels, etc.) est protégé par le droit d'auteur et le droit de la propriété intellectuelle.
            Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, des éléments du site est interdite sans l'autorisation écrite préalable de l'éditeur.
          </p>
        </section>

        <!-- Données personnelles -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">4. Protection des données personnelles</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.
          </p>
          <p class="mt-3">
            Pour exercer ces droits ou pour toute question relative à la protection de vos données, contactez-nous à :
            <a :href="`mailto:${storeConfig.contactEmail}`" class="text-brand hover:text-brand-light transition-colors">{{ storeConfig.contactEmail }}</a>
          </p>
          <p class="mt-3">
            Pour en savoir plus, consultez notre
            <NuxtLink to="/confidentialite" class="text-brand hover:text-brand-light transition-colors">Politique de Confidentialité</NuxtLink>.
          </p>
        </section>

        <!-- Cookies -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">5. Cookies</h2>
          <p>
            Le site utilise des cookies essentiels au fonctionnement du service (session, panier). Aucun cookie publicitaire ou de suivi tiers n'est utilisé sans votre consentement explicite.
          </p>
        </section>

        <!-- Médiation -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">6. Médiation des litiges</h2>
          <p>
            Conformément aux articles L.616-1 et R.616-1 du Code de la consommation, en cas de litige non résolu, le consommateur peut recourir gratuitement au service de médiation :
          </p>
          <p class="mt-3">
            Plateforme européenne de médiation accessible ci-dessous.
          </p>
          <p class="mt-3">
            Plateforme européenne de règlement en ligne des litiges :
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" class="text-brand hover:text-brand-light transition-colors">
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
        </section>

        <!-- Droit applicable -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">7. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || storeConfig.storeUrl
const siteDomain = storeConfig.storeUrl.replace('https://', '')

useSeoMeta({
  title: `Politique de Confidentialité - ${storeConfig.storeName}`,
  description: `Politique de confidentialité et de protection des données personnelles du site ${siteDomain} - RGPD.`,
  ogTitle: `Politique de Confidentialité - ${storeConfig.storeName}`,
  ogDescription: `Protection de vos données personnelles sur ${siteDomain}`,
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
        Politique de Confidentialité
      </h1>

      <div class="space-y-10 text-gray-300 leading-relaxed">
        <!-- Introduction -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">1. Introduction</h2>
          <p>
            La présente politique de confidentialité décrit comment <strong class="text-white">{{ storeConfig.storeName }}</strong> collecte, utilise et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </p>
        </section>

        <!-- Données collectées -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">2. Données collectées</h2>
          <p>Nous collectons les données suivantes lors de votre commande :</p>
          <ul class="list-disc list-inside mt-3 space-y-2">
            <li><strong class="text-white">Identité</strong> : nom complet</li>
            <li><strong class="text-white">Contact</strong> : adresse email</li>
            <li><strong class="text-white">Livraison</strong> : adresse postale (rue, ville, code postal, pays)</li>
            <li><strong class="text-white">Transaction</strong> : référence de paiement Stripe (aucune donnée bancaire n'est stockée sur nos serveurs)</li>
          </ul>
        </section>

        <!-- Finalités -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">3. Finalités du traitement</h2>
          <p>Vos données sont traitées pour les finalités suivantes :</p>
          <ul class="list-disc list-inside mt-3 space-y-2">
            <li>Traitement et suivi de vos commandes</li>
            <li>Livraison des produits commandés</li>
            <li>Communication relative à votre commande (confirmation, expédition, suivi)</li>
            <li>Gestion du service après-vente et des retours</li>
            <li>Respect de nos obligations légales et comptables</li>
          </ul>
        </section>

        <!-- Base légale -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">4. Base légale</h2>
          <p>
            Le traitement de vos données repose sur :
          </p>
          <ul class="list-disc list-inside mt-3 space-y-2">
            <li><strong class="text-white">L'exécution du contrat</strong> : traitement de votre commande et livraison</li>
            <li><strong class="text-white">L'obligation légale</strong> : conservation des factures et données comptables</li>
            <li><strong class="text-white">Le consentement</strong> : pour tout traitement non essentiel (newsletter, etc.)</li>
          </ul>
        </section>

        <!-- Destinataires -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">5. Destinataires des données</h2>
          <p>Vos données peuvent être transmises aux destinataires suivants :</p>
          <ul class="list-disc list-inside mt-3 space-y-2">
            <li><strong class="text-white">Stripe</strong> : prestataire de paiement sécurisé</li>
            <li><strong class="text-white">Transporteurs</strong> : pour la livraison de votre commande</li>
            <li><strong class="text-white">Hébergeur</strong> : pour le stockage sécurisé des données</li>
          </ul>
          <p class="mt-3">
            Aucune donnée n'est vendue ou transmise à des tiers à des fins commerciales.
          </p>
        </section>

        <!-- Durée de conservation -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">6. Durée de conservation</h2>
          <ul class="list-disc list-inside space-y-2">
            <li><strong class="text-white">Données de commande</strong> : 5 ans (obligation comptable)</li>
            <li><strong class="text-white">Données de contact</strong> : 3 ans après la dernière interaction</li>
            <li><strong class="text-white">Cookies</strong> : 13 mois maximum</li>
          </ul>
        </section>

        <!-- Droits -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul class="list-disc list-inside mt-3 space-y-2">
            <li><strong class="text-white">Droit d'accès</strong> : obtenir la communication de vos données</li>
            <li><strong class="text-white">Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong class="text-white">Droit à l'effacement</strong> : demander la suppression de vos données</li>
            <li><strong class="text-white">Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            <li><strong class="text-white">Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
            <li><strong class="text-white">Droit à la limitation</strong> : limiter le traitement de vos données</li>
          </ul>
          <p class="mt-3">
            Pour exercer vos droits, contactez-nous à :
            <a :href="`mailto:${storeConfig.contactEmail}`" class="text-brand hover:text-brand-light transition-colors">{{ storeConfig.contactEmail }}</a>
          </p>
          <p class="mt-3">
            Vous pouvez également introduire une réclamation auprès de la CNIL :
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-brand hover:text-brand-light transition-colors">www.cnil.fr</a>
          </p>
        </section>

        <!-- Sécurité -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">8. Sécurité</h2>
          <p>
            Nous mettons en oeuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
            Les paiements sont traités de manière sécurisée par Stripe (certifié PCI DSS niveau 1).
          </p>
        </section>

        <!-- Cookies -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">9. Cookies</h2>
          <p>
            Notre site utilise uniquement des cookies strictement nécessaires au fonctionnement du service :
          </p>
          <ul class="list-disc list-inside mt-3 space-y-2">
            <li><strong class="text-white">Cookies de session</strong> : maintien de votre panier et de votre session</li>
            <li><strong class="text-white">Cookies d'authentification</strong> : accès à l'espace administration</li>
          </ul>
          <p class="mt-3">
            Aucun cookie publicitaire ou de suivi tiers n'est déposé sans votre consentement explicite.
          </p>
        </section>

        <!-- Mise à jour -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">10. Mise à jour</h2>
          <p>
            La présente politique de confidentialité peut être modifiée à tout moment. La version en vigueur est celle accessible sur le site.
            Dernière mise à jour : mars 2026.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

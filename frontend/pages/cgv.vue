<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || storeConfig.storeUrl

useSeoMeta({
  title: `Conditions Générales de Vente - ${storeConfig.storeName}`,
  description: `Conditions générales de vente du site ${storeConfig.storeName} - Commande, livraison, retours et garanties.`,
  ogTitle: `CGV - ${storeConfig.storeName}`,
  ogDescription: `Conditions générales de vente ${storeConfig.storeName}`,
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
        Conditions Générales de Vente
      </h1>

      <div class="space-y-10 text-gray-300 leading-relaxed">
        <!-- Objet -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">1. Objet</h2>
          <p>
            Les présentes conditions générales de vente (CGV) régissent les ventes de produits effectuées sur le site
            <strong class="text-white">{{ storeConfig.storeUrl.replace('https://', '') }}</strong>. Toute commande implique l'acceptation sans réserve des présentes CGV.
          </p>
        </section>

        <!-- Produits -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">2. Produits</h2>
          <p>
            Les produits proposés à la vente sont décrits avec la plus grande exactitude possible. Les photographies illustrant les produits n'entrent pas dans le champ contractuel.
            En cas d'erreur, notre responsabilité ne saurait être engagée.
          </p>
        </section>

        <!-- Prix -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">3. Prix</h2>
          <p>
            Les prix sont indiqués en euros, toutes taxes comprises (TTC). Les frais de livraison sont offerts pour la France métropolitaine.
            L'éditeur se réserve le droit de modifier ses prix à tout moment, les produits étant facturés au prix en vigueur au moment de la commande.
          </p>
        </section>

        <!-- Commande -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">4. Commande</h2>
          <p>
            Le processus de commande comprend les étapes suivantes :
          </p>
          <ol class="list-decimal list-inside mt-3 space-y-2">
            <li>Sélection du produit et de ses options (couleur, quantité)</li>
            <li>Saisie des informations de livraison</li>
            <li>Paiement sécurisé via Stripe</li>
            <li>Confirmation de commande par email</li>
          </ol>
          <p class="mt-3">
            La commande est définitive après confirmation du paiement. Un email de confirmation est envoyé à l'adresse indiquée lors de la commande.
          </p>
        </section>

        <!-- Paiement -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">5. Paiement</h2>
          <p>
            Le paiement s'effectue par carte bancaire (Visa, Mastercard, CB) via la plateforme sécurisée Stripe.
            Vos données bancaires sont chiffrées et ne sont jamais stockées sur nos serveurs.
            Le débit est effectué au moment de la confirmation de commande.
          </p>
        </section>

        <!-- Livraison -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">6. Livraison</h2>
          <p>
            Les délais de livraison sont estimés entre <strong class="text-white">5 et 7 jours ouvrés</strong> pour la France métropolitaine.
            Un numéro de suivi vous sera communiqué par email dès l'expédition.
          </p>
          <p class="mt-3">
            En cas de retard significatif (au-delà de 30 jours), vous pouvez annuler votre commande et obtenir un remboursement intégral conformément à l'article L.216-2 du Code de la consommation.
          </p>
        </section>

        <!-- Droit de rétractation -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">7. Droit de rétractation</h2>
          <p>
            Conformément à l'article L.221-18 du Code de la consommation, vous disposez d'un délai de
            <strong class="text-white">14 jours</strong> à compter de la réception du produit pour exercer votre droit de rétractation, sans avoir à justifier de motif ni à payer de pénalité.
          </p>
          <p class="mt-3">
            Pour exercer ce droit, contactez-nous à
            <a :href="`mailto:${storeConfig.contactEmail}`" class="text-brand hover:text-brand-light transition-colors">{{ storeConfig.contactEmail }}</a>
            en indiquant votre numéro de commande. Le produit doit être retourné dans son état d'origine, dans un délai de 14 jours suivant la notification de rétractation.
          </p>
          <p class="mt-3">
            Le remboursement sera effectué dans les 14 jours suivant la réception du produit retourné, via le même moyen de paiement que celui utilisé lors de la commande.
            Les frais de retour sont à la charge du client.
          </p>
        </section>

        <!-- Garantie -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">8. Garanties</h2>
          <p>
            Outre la garantie commerciale de <strong class="text-white">30 jours satisfait ou remboursé</strong>, vous bénéficiez des garanties légales suivantes :
          </p>
          <ul class="list-disc list-inside mt-3 space-y-2">
            <li><strong class="text-white">Garantie légale de conformité</strong> (articles L.217-4 à L.217-14 du Code de la consommation) : 2 ans à compter de la livraison</li>
            <li><strong class="text-white">Garantie des vices cachés</strong> (articles 1641 à 1649 du Code civil) : 2 ans à compter de la découverte du défaut</li>
          </ul>
        </section>

        <!-- Réclamations -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">9. Service client</h2>
          <p>
            Pour toute question ou réclamation, contactez notre service client :
          </p>
          <p class="mt-3">
            Email : <a :href="`mailto:${storeConfig.contactEmail}`" class="text-brand hover:text-brand-light transition-colors">{{ storeConfig.contactEmail }}</a><br />
            Délai de réponse : 48 heures ouvrées maximum
          </p>
        </section>

        <!-- Médiation -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">10. Médiation</h2>
          <p>
            En cas de litige non résolu avec notre service client, vous pouvez recourir gratuitement au médiateur de la consommation désigné dans nos
            <NuxtLink to="/mentions-legales" class="text-brand hover:text-brand-light transition-colors">mentions légales</NuxtLink>.
          </p>
        </section>

        <!-- Droit applicable -->
        <section>
          <h2 class="font-display font-bold text-xl text-white mb-4">11. Droit applicable</h2>
          <p>
            Les présentes CGV sont soumises au droit français. En cas de litige, et après tentative de médiation, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

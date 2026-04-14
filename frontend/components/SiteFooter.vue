<template>
  <footer class="border-t border-white/10 bg-surface-dark relative overflow-hidden">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Top section: Shipping badge -->
      <div class="flex items-center justify-center py-6 border-b border-white/10">
        <div class="flex items-center gap-3 text-gray-400">
          <svg class="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <span class="text-sm font-medium">Livraison offerte en France métropolitaine</span>
        </div>
      </div>

      <!-- Main footer content -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12 sm:py-16">
        <!-- Column 1: Brand -->
        <div class="sm:col-span-2 lg:col-span-1">
          <a
            href="#"
            class="text-white font-display font-bold text-2xl uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:text-gray-300 inline-block mb-4"
            @click.prevent="scrollToTop"
          >
            CLIPBAG
          </a>
          <p class="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
            Le sac magnétique révolutionnaire pour vos bouteilles. Conçu pour les sportifs exigeants.
          </p>
          <!-- Social media links -->
          <div class="flex items-center gap-3">
            <a href="#" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-accent hover:border-accent/30 transition-all duration-200 cursor-pointer" aria-label="Instagram">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="#" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-accent hover:border-accent/30 transition-all duration-200 cursor-pointer" aria-label="Facebook">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-accent hover:border-accent/30 transition-all duration-200 cursor-pointer" aria-label="TikTok">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Navigation -->
        <div>
          <h4 class="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Navigation</h4>
          <nav class="flex flex-col gap-3" aria-label="Footer navigation">
            <a href="#testimonials-section" class="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer" @click.prevent="scrollToSection('testimonials-section')">Témoignages</a>
            <a href="#faq-section" class="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer" @click.prevent="scrollToSection('faq-section')">FAQ</a>
            <a href="#order-section" class="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer" @click.prevent="scrollToSection('order-section')">Commander</a>
          </nav>
        </div>

        <!-- Column 3: Legal -->
        <div>
          <h4 class="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Informations</h4>
          <nav class="flex flex-col gap-3" aria-label="Legal links">
            <a href="/mentions-legales" class="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Mentions légales</a>
            <a href="/cgv" class="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Conditions générales de vente</a>
            <a href="/confidentialite" class="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Politique de confidentialité</a>
            <a href="mailto:contact@clipbag.shop" class="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Contact</a>
          </nav>
        </div>

        <!-- Column 4: Payment methods -->
        <div>
          <h4 class="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Paiement sécurisé</h4>
          <div class="grid grid-cols-4 gap-2 mb-6 w-full">
            <!-- Visa -->
            <div class="flex items-center justify-center h-10 bg-white/5 border border-white/10 rounded-lg">
              <svg class="h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                <path d="M19.5 21.5h-3l1.9-11.7h3l-1.9 11.7zm12.8-11.4c-.6-.2-1.5-.5-2.7-.5-3 0-5.1 1.5-5.1 3.7 0 1.6 1.5 2.5 2.7 3.1 1.2.6 1.6.9 1.6 1.4 0 .8-.9 1.1-1.8 1.1-1.2 0-1.8-.2-2.8-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.3.6 3.2 0 5.3-1.5 5.3-3.8 0-1.3-.8-2.2-2.5-3-1-.5-1.7-.9-1.7-1.4 0-.5.5-1 1.7-1 1 0 1.7.2 2.2.4l.3.1.3-2.4zm7.9-.3h-2.3c-.7 0-1.3.2-1.6.9l-4.4 10.8h3.2l.6-1.8h3.8l.4 1.8h2.8l-2.5-11.7zm-3.7 7.5l1.2-3.2.5-1.5.3 1.5.7 3.2h-2.7zM17 9.8l-2.8 8-.3-1.5c-.5-1.8-2.2-3.8-4.1-4.8l2.7 10h3.2l4.8-11.7H17z" fill="white"/>
                <path d="M11.7 9.8H6.5l-.1.3c3.8.9 6.3 3.2 7.3 5.9l-1.1-5.3c-.2-.7-.7-.9-1-.9z" fill="#F9A533"/>
              </svg>
            </div>
            <!-- Mastercard -->
            <div class="flex items-center justify-center h-10 bg-white/5 border border-white/10 rounded-lg">
              <svg class="h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#252525"/>
                <circle cx="19" cy="16" r="8" fill="#EB001B"/>
                <circle cx="29" cy="16" r="8" fill="#F79E1B"/>
                <path d="M24 10.3a8 8 0 010 11.4 8 8 0 000-11.4z" fill="#FF5F00"/>
              </svg>
            </div>
            <!-- CB -->
            <div class="flex items-center justify-center h-10 bg-white/5 border border-white/10 rounded-lg">
              <span class="text-xs font-display font-semibold text-gray-400">CB</span>
            </div>
            <!-- Stripe -->
            <div class="flex items-center justify-center h-10 bg-white/5 border border-white/10 rounded-lg">
              <svg class="h-4" viewBox="0 0 60 25" fill="none">
                <path d="M60 12.5C60 5.6 55.4 0 48.1 0c-7.4 0-12.4 5.6-12.4 12.4 0 8.2 5.5 12.5 13.4 12.5 3.9 0 6.8-.9 9-2.1V18c-2.2 1.1-4.7 1.8-7.9 1.8-3.1 0-5.9-1.1-6.3-4.9h15.8c0-.4.3-2.1.3-3.4zM44 9.3c0-3.6 2.2-5.1 4.2-5.1 2 0 4 1.5 4 5.1H44zm-17.3-9C24.6.3 23.4 1.7 22.9 2.6l-.2-2.3h-5.6v32.1l6.4-1.4V25c.5.4 1.3.9 2.7.9 5.4 0 10.4-4.4 10.4-13.9-.1-8.8-5.1-12.7-9.9-12.7zM25 19.6c-.9 0-1.4-.3-1.8-.7v-9.4c.4-.5 1-8 1.8-.8 2.8 0 4.7 3.1 4.7 6.4 0 3.5-1.8 6.5-4.7 6.5zM14.4 0l-6.5 1.4v5.1L0 8.2v4.9h1.5v8c0 5.1 2.4 6.9 5.8 6.9 1.7 0 3-.4 4-.8V22c-.7.3-2.5.8-3.8.8-1.7 0-2.4-.7-2.4-2.7v-6.2h4V9.1H5.1V2.5l6.5-1.4V.1l2.8-.1z" fill="#6772E5"/>
              </svg>
            </div>
            <!-- Apple Pay -->
            <div class="flex items-center justify-center h-10 bg-white/5 border border-white/10 rounded-lg">
              <svg class="h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#000"/>
                <path d="M15.2 10.5c-.5.6-1.3 1-2 1-.1-.8.3-1.6.7-2.1.5-.6 1.3-1 2-1 .1.8-.2 1.6-.7 2.1zm.7 1.1c-1.1-.1-2.1.6-2.6.6-.5 0-1.4-.6-2.2-.6-1.2 0-2.2.7-2.8 1.7-1.2 2-.3 5 .8 6.7.6.8 1.2 1.7 2.1 1.7.8 0 1.2-.5 2.2-.5s1.3.5 2.2.5c.9 0 1.5-.9 2.1-1.7.6-.9.9-1.8.9-1.8-1-.4-1.8-1.5-1.8-2.8 0-1.1.6-2.1 1.5-2.7-.6-.8-1.5-1.2-2.4-1.1z" fill="white"/>
                <path d="M24.5 9.8c2.4 0 4 1.6 4 4s-1.7 4-4.1 4H22v4.1h-1.9V9.8h4.4zm-2.5 6.5h2c1.6 0 2.5-1 2.5-2.5s-.9-2.5-2.5-2.5h-2v5zm8.3 2c0-1.6 1.2-2.5 3.4-2.6l2.5-.2v-.7c0-1-.7-1.6-1.8-1.6-1.1 0-1.8.6-1.9 1.4h-1.7c.1-1.7 1.5-3 3.7-3 2.2 0 3.6 1.2 3.6 3.1v6.2h-1.8v-1.5c-.5 1-1.6 1.6-2.9 1.6-1.8 0-3.1-1.1-3.1-2.7zm5.9-.8v-.7l-2.3.1c-1.1.1-1.8.6-1.8 1.4 0 .8.7 1.3 1.7 1.3 1.4 0 2.4-.9 2.4-2.1zm3.1 5.3c.2.1.7.1.8.1.6 0 1-.3 1.3-1l.2-.5-3.4-9.1h2l2.4 7.3 2.4-7.3h1.9l-3.5 9.6c-.7 2-1.6 2.6-3.3 2.6-.2 0-.6 0-.8-.1v-1.6z" fill="white"/>
              </svg>
            </div>
            <!-- Google Pay -->
            <div class="flex items-center justify-center h-10 bg-white/5 border border-white/10 rounded-lg">
              <svg class="h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#fff" stroke="#e0e0e0" stroke-width=".5"/>
                <path d="M22.3 16.1v3.8h-1.2V10h3.2c.8 0 1.5.3 2 .8.6.5.8 1.1.8 1.9s-.3 1.4-.8 1.9c-.5.5-1.2.8-2 .8h-2zm0-4.9v3.7h2c.5 0 .9-.2 1.3-.5.3-.3.5-.8.5-1.3 0-.5-.2-1-.5-1.3-.3-.4-.8-.5-1.3-.5h-2z" fill="#3C4043"/>
                <path d="M29.7 13c.9 0 1.6.2 2.1.7.5.5.8 1.2.8 2v4.2h-1.2v-.9c-.4.7-1 1.1-1.8 1.1-.7 0-1.3-.2-1.8-.6-.4-.4-.7-.9-.7-1.5s.2-1.1.7-1.5c.5-.4 1.1-.5 1.9-.5.7 0 1.2.1 1.7.4v-.3c0-.5-.2-.9-.5-1.2-.3-.3-.7-.5-1.2-.5-.7 0-1.2.3-1.5.9l-1.1-.4c.5-1 1.3-1.4 2.6-1.4zm-1.6 4.9c0 .4.2.6.5.9.3.2.6.3 1 .3.5 0 1-.2 1.4-.6.4-.4.6-.8.6-1.3-.4-.3-.9-.5-1.6-.5-.5 0-.9.1-1.3.4-.4.2-.6.5-.6.8z" fill="#3C4043"/>
                <path d="M38.4 13.2l-4.1 9.4h-1.2l1.5-3.3-2.7-6.1h1.3l2 4.7 1.9-4.7h1.3z" fill="#3C4043"/>
                <path d="M17.7 15.4c0-.3 0-.6-.1-.9h-5v1.7h2.9c-.1.6-.5 1.2-1 1.5v1.3h1.6c1-.9 1.6-2.2 1.6-3.6z" fill="#4285F4"/>
                <path d="M12.6 19.9c1.4 0 2.5-.5 3.3-1.2l-1.6-1.3c-.5.3-1 .5-1.7.5-1.3 0-2.4-.9-2.8-2h-1.7v1.3c.9 1.6 2.6 2.7 4.5 2.7z" fill="#34A853"/>
                <path d="M9.8 15.9c-.1-.3-.2-.7-.2-1s.1-.7.2-1v-1.4H8.2c-.4.7-.6 1.5-.6 2.4s.2 1.7.6 2.4l1.6-1.4z" fill="#FBBC04"/>
                <path d="M12.6 11.9c.7 0 1.4.3 1.9.7l1.4-1.4c-.9-.8-2-1.3-3.3-1.3-1.9 0-3.5 1.1-4.4 2.7l1.6 1.3c.4-1.2 1.5-2 2.8-2z" fill="#EA4335"/>
              </svg>
            </div>
            <!-- Samsung Pay -->
            <div class="flex items-center justify-center h-10 bg-white/5 border border-white/10 rounded-lg">
              <svg class="h-4" viewBox="0 0 48 20" fill="none">
                <path d="M5.8 7.4C5.5 5.6 3.8 4.8 2 5.2c-.7.1-1.3.5-1.6 1-.3.4-.3.9-.1 1.3.2.5.7.8 1.5.9l1.5.2c.6.1 1 .3 1 .7 0 .5-.5.8-1.2.8-.8 0-1.3-.3-1.5-.9l-1.3.4c.3 1 1.2 1.6 2.7 1.6 1.7 0 2.8-.8 2.8-2.1 0-1.1-.8-1.7-2.1-1.9l-1.1-.2c-.5-.1-.9-.2-.9-.6 0-.4.4-.7 1-.7.6 0 1.1.3 1.2.8l1.9-.5z" fill="#1428A0"/>
                <path d="M9.9 5.2c-1 0-1.7.4-2.1 1v-.9H6.4v5.9h1.5V8.4c0-.8.5-1.4 1.3-1.4.7 0 1.1.5 1.1 1.2v3h1.5V8c0-1.7-.7-2.8-1.9-2.8z" fill="#1428A0"/>
                <path d="M16.2 5.3h-1.5v.9c-.4-.6-1.1-1-2-1-1.7 0-3 1.4-3 3.1s1.3 3.1 3 3.1c.9 0 1.6-.4 2-.9v.8h1.5V5.3zm-3.3 4.8c-1 0-1.7-.7-1.7-1.8s.7-1.8 1.7-1.8c1 0 1.7.8 1.7 1.8s-.7 1.8-1.7 1.8z" fill="#1428A0"/>
                <path d="M24.6 5.3h-1.5v.8c-.4-.6-1-.9-1.8-.9-1.6 0-2.8 1.4-2.8 3.1s1.2 3.1 2.8 3.1c.8 0 1.5-.3 1.9-.9v.8h1.4V5.3zm-3.1 4.8c-.9 0-1.6-.7-1.6-1.8s.7-1.8 1.6-1.8c1 0 1.6.8 1.6 1.8s-.6 1.8-1.6 1.8z" fill="#1428A0"/>
                <path d="M28 5.2c-.7 0-1.3.3-1.7.8v-.7h-1.4v8h1.5V10c.4.6 1 .9 1.7.9 1.6 0 2.7-1.3 2.7-3.1 0-1.7-1.1-2.6-2.8-2.6zm-.3 4.9c-1 0-1.6-.8-1.6-1.8s.6-1.8 1.6-1.8c.9 0 1.5.7 1.5 1.8s-.6 1.8-1.5 1.8z" fill="#1428A0"/>
                <path d="M34.5 5.2c-1 0-1.7.4-2.1 1v-.9H31v5.9h1.5V8.4c0-.8.5-1.4 1.3-1.4.7 0 1.1.5 1.1 1.2v3h1.5V8c0-1.7-.7-2.8-1.9-2.8z" fill="#1428A0"/>
                <path d="M41.2 5.3h-1.5v.9c-.4-.6-1.1-1-2-1-1.7 0-3 1.4-3 3.1s1.3 3.1 3 3.1c.9 0 1.6-.4 2-.9v.8h1.5V5.3zm-3.3 4.8c-1 0-1.7-.7-1.7-1.8s.7-1.8 1.7-1.8c1 0 1.7.8 1.7 1.8s-.7 1.8-1.7 1.8z" fill="#1428A0"/>
                <path d="M44.5 13.5h-1.2l2.3-3.1-2.2-3h1.4l1.5 2 1.5-2H48l-2.2 3 2.3 3.1h-1.4l-1.6-2.2-1.6 2.2z" fill="#1428A0"/>
                <text x="24" y="18" text-anchor="middle" font-size="4" fill="#1428A0" font-weight="bold">Pay</text>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 leading-relaxed">
            Toutes les transactions sont sécurisées et chiffrées via Stripe.
          </p>
        </div>
      </div>

      <!-- NMF Agence credit — above separator so it's visible on mobile -->
      <div class="text-center pb-4">
        <p class="text-xs text-gray-500">
          Site conçu par
          <a
            href="https://www.nmf-agence.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-accent transition-colors duration-200 font-medium"
          >
            NMF Agence
          </a>
        </p>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/10 py-6 pb-24 sm:pb-6 flex items-center justify-center">
        <p class="text-xs text-gray-500">
          &copy; 2026 ClipBag. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ClipBag',
        url: 'https://clipbag.shop',
        logo: 'https://clipbag.shop/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'contact@clipbag.shop',
          contactType: 'customer service',
          availableLanguage: 'French',
        },
        sameAs: [],
      }),
    },
  ],
})
</script>

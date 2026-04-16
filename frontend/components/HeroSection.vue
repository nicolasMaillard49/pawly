<template>
  <section id="hero-section" class="bg-white pt-20 pb-0 sm:pt-28 sm:pb-0 relative overflow-hidden lg:min-h-[80vh]">
    <!-- Subtle geometric accent -->
    <div class="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-accent/[0.04] rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none"></div>

    <!-- Paw prints scattered across hero background -->
    <img src="/images/logo_black.png" alt="" aria-hidden="true" class="absolute top-24 left-[6%] w-8 h-8 sm:w-10 sm:h-10 opacity-[0.08] -rotate-12 pointer-events-none select-none" />
    <img src="/images/logo_black.png" alt="" aria-hidden="true" class="absolute top-[42%] left-[2%] w-10 h-10 sm:w-12 sm:h-12 opacity-[0.07] rotate-[25deg] pointer-events-none select-none hidden sm:block" />
    <img src="/images/logo_black.png" alt="" aria-hidden="true" class="absolute bottom-10 right-[8%] w-10 h-10 sm:w-14 sm:h-14 opacity-[0.09] -rotate-[18deg] pointer-events-none select-none" />
    <img src="/images/logo_black.png" alt="" aria-hidden="true" class="absolute bottom-[28%] right-[3%] w-6 h-6 sm:w-8 sm:h-8 opacity-[0.07] rotate-[40deg] pointer-events-none select-none hidden lg:block" />

    <div class="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
      <div class="lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-12 xl:gap-16 lg:items-start">

        <!-- LEFT: Product gallery -->
        <div class="relative mb-8 lg:mb-0 hero-image-in">

          <!-- MOBILE: Native scroll carousel -->
          <div class="lg:hidden">
            <div
              ref="mobileScrollRef"
              class="gallery-scroll flex overflow-x-auto snap-x snap-mandatory"
              @scroll="onMobileScroll"
              @touchstart="pauseAutoplay"
              @touchend="resumeAutoplay"
            >
              <div
                v-for="(img, i) in productImages"
                :key="i"
                class="gallery-scroll__item flex-shrink-0 snap-center"
              >
                <img
                  :src="img"
                  :alt="storeConfig.hero.imageAlt"
                  class="w-full h-full object-cover object-[center_55%] rounded-2xl"
                  :fetchpriority="i === 0 ? 'high' : 'auto'"
                  :loading="i < 2 ? 'eager' : 'lazy'"
                />
              </div>
            </div>
            <!-- Thumbnails (mobile) -->
            <div class="flex items-center justify-center gap-2 mt-3 overflow-x-auto thumbnails-scroll px-4">
              <button
                v-for="(img, i) in productImages"
                :key="i"
                class="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer"
                :class="i === currentImageIndex ? 'border-accent shadow-sm' : 'border-transparent opacity-50'"
                @click="goToImageMobile(i)"
              >
                <img
                  :src="img"
                  :alt="`${storeConfig.storeName} vue ${i + 1}`"
                  class="w-full h-full object-contain"
                  loading="lazy"
                />
              </button>
            </div>
          </div>

          <!-- DESKTOP: Thumbnails left + main image -->
          <div class="hidden lg:flex lg:flex-row lg:gap-3">
            <div class="flex flex-col gap-2 overflow-y-auto thumbnails-scroll max-h-[clamp(400px,60vh,720px)] w-[72px] flex-shrink-0">
              <button
                v-for="(img, i) in productImages"
                :key="i"
                class="flex-shrink-0 w-[64px] h-[64px] rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer"
                :class="i === currentImageIndex ? 'border-accent shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'"
                :aria-label="`Image ${i + 1}`"
                :aria-current="i === currentImageIndex"
                @click="goToImage(i)"
              >
                <img
                  :src="img"
                  :alt="`${storeConfig.storeName} vue ${i + 1}`"
                  class="w-full h-full object-contain rounded-sm"
                  loading="lazy"
                />
              </button>
            </div>

            <div
              class="relative group flex-1 cursor-pointer"
              @click="onDesktopClick"
            >
              <div class="gallery-main relative overflow-hidden rounded-2xl bg-transparent">
                <div class="gallery-main__container relative w-full aspect-square lg:aspect-auto lg:h-[clamp(400px,60vh,720px)]">
                  <transition :name="carouselDirection">
                    <img
                      :key="currentImageIndex"
                      :src="productImages[currentImageIndex]"
                      :alt="storeConfig.hero.imageAlt"
                      class="absolute inset-0 w-full h-full rounded-2xl object-cover"
                      fetchpriority="high"
                      loading="eager"
                    />
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Product info + Order form -->
        <div id="order-section" class="text-center lg:text-left min-w-0">

          <!-- BLOC 1: Aligned with carousel height -->
          <div class="lg:flex lg:flex-col">


          <!-- Social proof -->
          <div class="flex items-center justify-center lg:justify-start gap-2 mb-5 hero-fade-in flex-nowrap overflow-hidden" style="animation-delay: 0.1s">
            <div class="flex items-center gap-0.5 flex-shrink-0">
              <svg v-for="s in 4" :key="s" class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <!-- Half star -->
              <svg class="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20">
                <defs><linearGradient id="half"><stop offset="50%" stop-color="#FACC15" /><stop offset="50%" stop-color="#D1D5DB" /></linearGradient></defs>
                <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="text-text-muted text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0">87 avis</span>
            <span class="w-1 h-1 rounded-full bg-text-muted/40 flex-shrink-0"></span>
            <LiveViewers />
          </div>

          <!-- H1 with paw-print trail to the right -->
          <div class="relative mb-5 lg:mb-6 hero-fade-in" style="animation-delay: 0.2s">
            <h1 class="font-display font-bold text-[22px] sm:text-[28px] lg:text-[clamp(1.5rem,2.5vw,2.125rem)] uppercase tracking-tight text-text leading-[1.1] inline">
              {{ storeConfig.hero.headline }}
              <span class="inline-flex items-center gap-1 align-middle ml-2 sm:ml-3" aria-hidden="true">
                <img src="/images/logo_black.png" alt="" class="w-5 h-5 sm:w-6 sm:h-6 -rotate-12 opacity-40 select-none" />
                <img src="/images/logo_black.png" alt="" class="w-6 h-6 sm:w-7 sm:h-7 rotate-6 opacity-60 -translate-y-1 select-none" />
                <img src="/images/logo_black.png" alt="" class="w-7 h-7 sm:w-9 sm:h-9 -rotate-3 opacity-90 select-none" />
              </span>
            </h1>
          </div>

          <!-- Description -->
          <p class="text-text-muted text-sm sm:text-base mb-4 lg:mb-5 max-w-lg mx-auto lg:mx-0 leading-relaxed hero-fade-in" style="animation-delay: 0.3s">
            {{ storeConfig.hero.subheadline }}
          </p>

          <!-- Promo badge -->
          <div class="mb-4 lg:mb-5 hero-fade-in" style="animation-delay: 0.33s">
            <div class="inline-flex items-center gap-1.5 bg-urgency/10 text-urgency text-xs sm:text-sm font-display font-semibold px-3 py-1.5 rounded-full">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              {{ storeConfig.hero.badge }} — Offre limitée
            </div>
          </div>

          <!-- In stock badge + Price + Quantity -->
          <div class="flex items-center gap-1.5 mb-3 hero-fade-in" style="animation-delay: 0.38s">
            <span class="w-2 h-2 rounded-full bg-accent flex-shrink-0"></span>
            <span class="text-accent-dark text-xs font-display font-semibold uppercase tracking-wide">En stock</span>
          </div>
          <div class="flex items-end justify-between gap-3 mb-4 lg:mb-5 hero-fade-in" style="animation-delay: 0.4s">
            <div class="text-left min-w-0">
              <div class="flex items-baseline gap-2">
                <span class="font-display text-text-muted line-through text-sm sm:text-base whitespace-nowrap">{{ originalTotal }}</span>
                <span class="font-display font-medium text-[28px] sm:text-[34px] lg:text-[40px] text-text tracking-tight leading-none whitespace-nowrap">{{ formattedTotal }}</span>
              </div>
              <div class="flex items-center gap-1.5 mt-1">
                <svg class="w-3.5 h-3.5 text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-accent-dark text-xs font-display font-semibold">Économisez {{ savedAmount }}</span>
              </div>
            </div>

            <!-- Quantity -->
            <div class="flex-shrink-0">
              <div class="inline-flex items-center bg-surface-alt border border-border rounded-xl">
                <button
                  class="flex items-center justify-center w-9 h-9 text-text-muted hover:text-text transition-colors cursor-pointer focus:outline-none rounded-l-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="quantity <= 1"
                  aria-label="Diminuer"
                  @click="decrementQuantity"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" /></svg>
                </button>
                <span class="w-9 text-center text-text font-display font-bold text-sm select-none">{{ quantity }}</span>
                <button
                  class="flex items-center justify-center w-9 h-9 text-text-muted hover:text-text transition-colors cursor-pointer focus:outline-none rounded-r-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="quantity >= 10"
                  aria-label="Augmenter"
                  @click="incrementQuantity"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- CTA / Address Form — morphing container -->
          <div class="hero-fade-in" style="animation-delay: 0.5s">
            <!-- Security text — collapses when form opens -->
            <div class="overflow-hidden transition-all duration-400 ease-out"
                 :class="showAddressForm ? 'max-h-0 opacity-0 mb-0' : 'max-h-8 opacity-100 mb-2'">
              <p class="text-center text-[11px] text-text-muted">Paiement 100% sécurisé par Stripe &middot; Livraison offerte</p>
            </div>

            <!-- Morph container: pill button ↔ form card -->
            <div
              class="morph-container relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              :class="showAddressForm
                ? 'bg-surface-alt rounded-xl border border-border shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
                : 'bg-accent rounded-pill hover:bg-accent-hover active:scale-[0.98] cursor-pointer'"
              @click="!showAddressForm ? (showAddressForm = true) : null"
            >
              <!-- Button label — collapses out -->
              <div
                class="transition-all duration-300 ease-out text-center"
                :class="showAddressForm
                  ? 'max-h-0 py-0 opacity-0 pointer-events-none'
                  : 'max-h-20 py-4 opacity-100'"
              >
                <span class="text-white font-sans font-semibold text-base sm:text-lg px-8 select-none">AJOUTER AU PANIER</span>
              </div>

              <!-- Form content — expands in -->
              <div
                class="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                :class="showAddressForm
                  ? 'max-h-[700px] opacity-100 p-4 sm:p-5'
                  : 'max-h-0 opacity-0 p-0 overflow-hidden pointer-events-none'"
              >
                <!-- Close button -->
                <button
                  type="button"
                  class="absolute top-3 right-3 w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text hover:border-text/30 transition-colors cursor-pointer z-10"
                  aria-label="Fermer le formulaire"
                  @click.stop="showAddressForm = false"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <p class="text-xs text-text font-display font-semibold mb-4 morph-field" style="--field-i: 0">Adresse de livraison</p>
                <div class="grid gap-3 text-left">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="morph-field" style="--field-i: 1">
                      <label for="hero-lastname" class="block text-[11px] text-text-muted mb-1 font-medium">Nom *</label>
                      <input id="hero-lastname" v-model="customerLastName" type="text" required autocomplete="family-name" placeholder="Dupont"
                        class="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>
                    <div class="morph-field" style="--field-i: 2">
                      <label for="hero-firstname" class="block text-[11px] text-text-muted mb-1 font-medium">Prénom *</label>
                      <input id="hero-firstname" v-model="customerFirstName" type="text" required autocomplete="given-name" placeholder="Jean"
                        class="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>
                  </div>
                  <div class="morph-field" style="--field-i: 3">
                    <label for="hero-email" class="block text-[11px] text-text-muted mb-1 font-medium">Email *</label>
                    <input id="hero-email" v-model="customerEmail" type="email" required autocomplete="email" placeholder="jean@email.com"
                      class="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                  </div>
                  <div class="morph-field" style="--field-i: 4">
                    <label for="hero-phone" class="block text-[11px] text-text-muted mb-1 font-medium">Téléphone <span class="text-text-muted/60">(optionnel)</span></label>
                    <input id="hero-phone" v-model="customerPhone" type="tel" autocomplete="tel" placeholder="06 12 34 56 78"
                      class="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                  </div>
                  <div class="morph-field" style="--field-i: 5">
                    <label for="hero-addr" class="block text-[11px] text-text-muted mb-1 font-medium">Adresse *</label>
                    <input id="hero-addr" v-model="addressLine1" type="text" required autocomplete="address-line1" placeholder="12 rue de la Paix"
                      class="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                  </div>
                  <div class="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] gap-3 morph-field" style="--field-i: 6">
                    <div>
                      <label for="hero-cp" class="block text-[11px] text-text-muted mb-1 font-medium">Code postal *</label>
                      <input id="hero-cp" v-model="postalCode" type="text" required autocomplete="postal-code" placeholder="75001" maxlength="5" inputmode="numeric"
                        class="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>
                    <div>
                      <label for="hero-city" class="block text-[11px] text-text-muted mb-1 font-medium">Ville *</label>
                      <input id="hero-city" v-model="city" type="text" required autocomplete="address-level2" placeholder="Paris"
                        class="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>
                  </div>
                </div>

                <!-- Error -->
                <div v-if="error" class="mt-3 bg-urgency/10 border border-urgency/20 text-urgency text-sm rounded-lg px-3 py-2 flex items-center gap-2 morph-field" style="--field-i: 7">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {{ error }}
                </div>

                <!-- Pay button -->
                <button
                  class="mt-4 morph-field"
                  style="--field-i: 7"
                  :disabled="loading || !isAddressValid"
                  :class="[
                    'group w-full text-white font-sans font-semibold text-base sm:text-lg py-3 px-8 rounded-pill transition-all duration-150 ease-in-out focus:outline-none inline-flex items-center justify-center gap-3',
                    loading || !isAddressValid
                      ? 'bg-accent/50 cursor-not-allowed'
                      : 'bg-accent hover:bg-accent-hover cursor-pointer active:scale-[0.98]',
                  ]"
                  @click.stop="handleCheckout"
                >
                  <span v-if="loading" class="inline-flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-text" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Redirection...
                  </span>
                  <template v-else>
                    PAYER {{ formattedTotal }}
                  </template>
                </button>
                <p class="text-center text-[11px] text-text-muted mt-2 morph-field" style="--field-i: 8">Paiement 100% sécurisé par Stripe &middot; Livraison offerte</p>
              </div>
            </div>
          </div>
          </div>
          <!-- END BLOC 1 -->

          <!-- BLOC 2: Below carousel, still in right column -->
          <div class="mt-6">
              <!-- Politique de retour -->
              <div class="bg-[#f7f7f7] rounded-[0.625rem] p-6 sm:p-8 text-left">
                <div class="flex items-center gap-3 mb-3">
                  <img src="https://cdn.shopify.com/s/files/1/0821/0939/9074/files/30-Day_Return_Policy_Icon_Actus_Core_7.png?v=1757438371" alt="Icône de retour" class="w-6 h-6" loading="lazy" />
                  <p class="text-text text-lg sm:text-xl font-sans font-bold leading-tight">Politique de retour sous 30 jours</p>
                </div>
                <p class="text-text/60 text-sm sm:text-base leading-[1.6]">
                  <strong class="text-text font-bold">Profitez d'échanges sans tracas sous 30 jours !</strong> Si votre produit arrive endommagé ou ne correspond pas à votre commande, nous vous proposons un retour simple et rapide. Votre satisfaction est notre priorité.
                </p>
              </div>

              <!-- Description collapsible -->
              <div class="mt-5 text-left border-t border-b border-border">
                <button
                  type="button"
                  class="group w-full flex items-center justify-between py-4 cursor-pointer"
                  @click="showDescription = !showDescription"
                >
                  <span class="text-text text-sm font-sans font-bold">Déscription</span>
                  <span
                    class="w-7 h-7 rounded-full border border-border flex items-center justify-center transition-all duration-300 group-hover:border-text/30"
                    :class="{ 'rotate-180 border-text/30': showDescription }"
                  >
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" class="text-text-muted">
                      <path d="m1 1.5 3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </button>
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="max-h-0 opacity-0"
                  enter-to-class="max-h-[500px] opacity-100"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="max-h-[500px] opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <div v-if="showDescription" class="overflow-hidden">
                    <div class="px-4 pb-4 pt-1 space-y-2.5">
                      <div v-for="(benefit, idx) in storeConfig.benefits" :key="idx" class="flex items-start gap-2.5">
                        <svg class="w-4 h-4 text-accent-dark flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-text text-xs sm:text-sm leading-snug"><strong>{{ benefit.title }}</strong> — {{ benefit.description }}</span>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Trust marquee band -->
    <div class="mt-8 sm:mt-12 border-t border-b border-border bg-surface-alt/50 overflow-hidden hero-fade-in" style="animation-delay: 0.7s">
      <div class="trust-marquee py-3">
        <div class="trust-marquee__track">
          <template v-for="copy in 3" :key="copy">
            <div class="trust-marquee__item">
              <svg class="w-4 h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
              <span class="text-sm font-medium text-text whitespace-nowrap">Livraison gratuite</span>
            </div>
            <span class="trust-marquee__sep">&bull;</span>
            <div class="trust-marquee__item">
              <svg class="w-4 h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
              <span class="text-sm font-medium text-text whitespace-nowrap">Garantie 30 jours</span>
            </div>
            <span class="trust-marquee__sep">&bull;</span>
            <div class="trust-marquee__item">
              <svg class="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-sm font-medium text-text whitespace-nowrap">Paiement sécurisé</span>
            </div>
            <span class="trust-marquee__sep">&bull;</span>
            <div class="trust-marquee__item">
              <a :href="storeConfig.social.trustpilot || '#'" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5">
                <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1.5l2.76 8.5h8.94l-7.23 5.26 2.76 8.5L12 18.5l-7.23 5.26 2.76-8.5L.3 10h8.94L12 1.5z" fill="#00B67A" />
                </svg>
                <span class="text-sm font-display font-semibold text-text whitespace-nowrap">4.5</span>
                <span class="text-sm text-text-muted whitespace-nowrap">Trustpilot</span>
              </a>
            </div>
            <span class="trust-marquee__sep">&bull;</span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

const productStore = useProductStore()
const { track: fbTrack } = useMetaPixel()

// === Gallery ===
const productImages = computed(() => {
  const imgs = productStore.product?.images
  if (imgs && imgs.length > 0) return imgs
  return [
    '/images/product/product-1.png',
    '/images/product/product-2.png',
    '/images/product/product-3.png',
    '/images/product/product-4.png',
    '/images/product/product-5.png',
  ]
})

const currentImageIndex = ref(0)
const carouselDirection = ref('carousel-next')
const mobileScrollRef = ref<HTMLElement | null>(null)
let autoplayTimer: ReturnType<typeof setInterval> | null = null
let autoplayPaused = false

const goToImage = (index: number) => {
  carouselDirection.value = index > currentImageIndex.value ? 'carousel-next' : 'carousel-prev'
  currentImageIndex.value = index
}

const nextImage = () => {
  carouselDirection.value = 'carousel-next'
  currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length
  scrollMobileToIndex(currentImageIndex.value)
}

const prevImage = () => {
  carouselDirection.value = 'carousel-prev'
  currentImageIndex.value = (currentImageIndex.value - 1 + productImages.value.length) % productImages.value.length
  scrollMobileToIndex(currentImageIndex.value)
}

const goToImageMobile = (index: number) => {
  currentImageIndex.value = index
  scrollMobileToIndex(index)
}

const onDesktopClick = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  if (e.clientX - rect.left < rect.width / 2) prevImage()
  else nextImage()
}

const onMobileScroll = () => {
  const el = mobileScrollRef.value
  if (!el) return
  const itemWidth = el.children[0]?.clientWidth || 1
  const index = Math.round(el.scrollLeft / itemWidth)
  if (index !== currentImageIndex.value && index >= 0 && index < productImages.value.length) {
    currentImageIndex.value = index
  }
}

const scrollMobileToIndex = (index: number) => {
  const el = mobileScrollRef.value
  if (!el || !el.children[index]) return
  const child = el.children[index] as HTMLElement
  el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' })
}

const startAutoplay = () => { stopAutoplay(); autoplayTimer = setInterval(() => { if (!autoplayPaused) nextImage() }, 4000) }
const stopAutoplay = () => { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null } }
const pauseAutoplay = () => { autoplayPaused = true }
const resumeAutoplay = () => { autoplayPaused = false }

// === Order logic (from OrderSection) ===
const quantity = ref(1)
const loading = ref(false)
const error = ref('')
const showAddressForm = ref(false)
const showDescription = ref(false)
const customerLastName = ref('')
const customerFirstName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const addressLine1 = ref('')
const postalCode = ref('')
const city = ref('')

const isAddressValid = computed(() =>
  customerLastName.value.trim().length >= 2 &&
  customerFirstName.value.trim().length >= 2 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.value) &&
  addressLine1.value.trim().length >= 3 &&
  /^\d{5}$/.test(postalCode.value.trim()) &&
  city.value.trim().length >= 1
)

const decrementQuantity = () => { if (quantity.value > 1) quantity.value-- }
const incrementQuantity = () => { if (quantity.value < 10) quantity.value++ }

const unitPrice = computed(() => productStore.product?.price || storeConfig.product.defaultPrice)
const originalUnitPrice = computed(() => productStore.product?.comparePrice || storeConfig.product.originalPrice)

const formattedTotal = computed(() => {
  const total = unitPrice.value * quantity.value
  return `${total.toFixed(2).replace('.', ',')}€`
})

const originalTotal = computed(() => {
  return `${(originalUnitPrice.value * quantity.value).toFixed(2).replace('.', ',')}€`
})

const savedAmount = computed(() => {
  const original = originalUnitPrice.value * quantity.value
  const actual = unitPrice.value * quantity.value
  return `${(original - actual).toFixed(2).replace('.', ',')}€`
})

const handleCheckout = async () => {
  if (!isAddressValid.value) { error.value = 'Veuillez remplir tous les champs obligatoires.'; return }
  loading.value = true
  error.value = ''
  try {
    const totalValue = unitPrice.value * quantity.value
    const pixelParams = { content_name: productStore.product?.name || storeConfig.product.name, content_ids: [productStore.product?.id || ''], content_type: 'product', num_items: quantity.value, value: totalValue, currency: 'EUR' }
    fbTrack('AddToCart', pixelParams)
    fbTrack('InitiateCheckout', pixelParams)
    const { apiFetch } = useApi()
    const response = await apiFetch<{ sessionId: string; url: string }>('/payments/create-checkout', {
      method: 'POST',
      body: {
        productId: productStore.product?.id || '', quantity: quantity.value,
        customerName: (customerFirstName.value.trim() + ' ' + customerLastName.value.trim()), customerEmail: customerEmail.value.trim(),
        customerPhone: customerPhone.value.trim() || undefined,
        shippingAddress: { line1: addressLine1.value.trim(), city: city.value.trim(), postalCode: postalCode.value.trim(), country: 'FR' },
      },
    })
    if (response.url) window.location.href = response.url
  } catch (e: any) {
    error.value = e?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

onMounted(() => { startAutoplay() })
onUnmounted(() => { stopAutoplay() })
</script>

<style scoped>
.hero-fade-in {
  opacity: 0;
  animation: hero-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes hero-enter {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.hero-image-in {
  opacity: 0;
  animation: hero-image-enter 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
}
@keyframes hero-image-enter {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

/* Mobile carousel */
.gallery-scroll { scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; gap: 0; }
.gallery-scroll::-webkit-scrollbar { display: none; }
.gallery-scroll__item { width: calc(100vw - 32px); aspect-ratio: 4 / 5; }

/* Desktop carousel transitions */
.carousel-next-enter-active, .carousel-prev-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; z-index: 2; }
.carousel-next-leave-active, .carousel-prev-leave-active { transition: opacity 0.25s ease; z-index: 1; }
.carousel-next-enter-from { opacity: 0; transform: translateX(20px); }
.carousel-next-leave-to { opacity: 0; }
.carousel-prev-enter-from { opacity: 0; transform: translateX(-20px); }
.carousel-prev-leave-to { opacity: 0; }

/* Thumbnails */
.thumbnails-scroll { scrollbar-width: none; -ms-overflow-style: none; }
.thumbnails-scroll::-webkit-scrollbar { display: none; }

/* Trust marquee */
.trust-marquee { position: relative; width: 100%; }
.trust-marquee__track { display: flex; align-items: center; gap: 0; width: max-content; animation: marquee-scroll 30s linear infinite; }
.trust-marquee__item { display: flex; align-items: center; gap: 6px; padding: 0 16px; }
.trust-marquee__sep { color: rgba(16,16,16,0.15); font-size: 10px; user-select: none; }
@keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
.trust-marquee:hover .trust-marquee__track { animation-play-state: paused; }

/* Morph container — staggered field reveal */
.morph-field {
  opacity: 0;
  transform: translateY(10px);
}
.morph-container:not(.rounded-pill) .morph-field {
  animation: morph-field-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(0.15s + var(--field-i, 0) * 0.05s);
}
@keyframes morph-field-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-fade-in, .hero-image-in { animation: none; opacity: 1; transform: none; }
  .carousel-next-enter-active, .carousel-next-leave-active, .carousel-prev-enter-active, .carousel-prev-leave-active { transition: none; }
  .trust-marquee__track { animation: none; }
  .morph-field { opacity: 1; transform: none; animation: none; }
  .morph-container { transition: none; }
}
</style>

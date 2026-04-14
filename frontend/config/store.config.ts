export interface StoreConfig {
  // Identity
  storeName: string
  storeUrl: string
  contactEmail: string
  orderPrefix: string

  // Product
  product: {
    name: string
    tagline: string
    description: string
    defaultPrice: number
    originalPrice: number
    currency: string
    deliveryDays: string
  }

  // Analytics & Tracking
  analytics: {
    metaPixelId: string
    ga4Id: string
  }

  // Theme
  theme: {
    primary: string
    primaryHover: string
    secondary: string
    background: string
    surfaceDark: string
    text: string
    font: string
  }

  // Hero
  hero: {
    headline: string
    subheadline: string
    badge: string
    imageAlt: string
  }

  // Benefits (collapsible description)
  benefits: {
    icon: string
    title: string
    description: string
  }[]

  // Problems / Features
  problems: {
    pain: string
    solution: string
    image: string
    alt: string
  }[]

  // Explanation section
  explanation: {
    title: string
    subtitle: string
    videoSrc: string
    features: { icon: string; text: string }[]
  }

  // Testimonials
  reviews: {
    name: string
    rating: number
    text: string
    sport: string
    verified: boolean
  }[]

  // FAQ
  faq: {
    question: string
    answer: string
  }[]

  // Social
  social: {
    instagram: string
    tiktok: string
    facebook: string
    trustpilot: string
  }

  // Guarantees / reassurances
  guarantees: {
    icon: string
    label: string
  }[]

  // Legal
  legal: {
    companyName: string
    address: string
    director: string
    host: string
  }

  // Agency credit (optional)
  credit?: {
    name: string
    url: string
  }
}

export const storeConfig: StoreConfig = {
  // ═══════════════════════════════════
  // IDENTITY — Change these for your store
  // ═══════════════════════════════════
  storeName: 'MON STORE',
  storeUrl: 'https://monstore.shop',
  contactEmail: 'contact@monstore.shop',
  orderPrefix: 'MS',

  // ═══════════════════════════════════
  // PRODUCT
  // ═══════════════════════════════════
  product: {
    name: 'Nom du Produit',
    tagline: 'Accroche principale du produit',
    description: 'Description courte du produit pour le SEO et les réseaux sociaux.',
    defaultPrice: 29.99,
    originalPrice: 49.99,
    currency: 'EUR',
    deliveryDays: '5-7',
  },

  // ═══════════════════════════════════
  // ANALYTICS
  // ═══════════════════════════════════
  analytics: {
    metaPixelId: '',
    ga4Id: '',
  },

  // ═══════════════════════════════════
  // THEME — Colors and fonts
  // ═══════════════════════════════════
  theme: {
    primary: '#9BCBEB',
    primaryHover: '#7FB3D9',
    secondary: '#000000',
    background: '#ffffff',
    surfaceDark: '#000000',
    text: '#000000',
    font: 'Inconsolata',
  },

  // ═══════════════════════════════════
  // HERO SECTION
  // ═══════════════════════════════════
  hero: {
    headline: 'Titre principal accrocheur',
    subheadline: 'Sous-titre qui décrit le bénéfice principal',
    badge: '',
    imageAlt: 'Photo du produit',
  },

  // ═══════════════════════════════════
  // BENEFITS (collapsible description)
  // ═══════════════════════════════════
  benefits: [
    { icon: 'bolt', title: 'Bénéfice 1', description: 'Description du premier avantage produit' },
    { icon: 'shield', title: 'Bénéfice 2', description: 'Description du deuxième avantage produit' },
    { icon: 'phone', title: 'Bénéfice 3', description: 'Description du troisième avantage produit' },
    { icon: 'gift', title: 'Bénéfice 4', description: 'Description du quatrième avantage produit' },
    { icon: 'link', title: 'Bénéfice 5', description: 'Description du cinquième avantage produit' },
    { icon: 'scale', title: 'Bénéfice 6', description: 'Description du sixième avantage produit' },
  ],

  // ═══════════════════════════════════
  // PROBLEMS / FEATURES SECTION
  // ═══════════════════════════════════
  problems: [
    { pain: 'Problème 1', solution: 'Solution apportée par le produit', image: '', alt: 'Feature 1' },
    { pain: 'Problème 2', solution: 'Solution apportée par le produit', image: '', alt: 'Feature 2' },
    { pain: 'Problème 3', solution: 'Solution apportée par le produit', image: '', alt: 'Feature 3' },
    { pain: 'Problème 4', solution: 'Solution apportée par le produit', image: '', alt: 'Feature 4' },
  ],

  // ═══════════════════════════════════
  // EXPLANATION / VIDEO SECTION
  // ═══════════════════════════════════
  explanation: {
    title: 'Comment ça marche',
    subtitle: 'Découvrez le produit en action',
    videoSrc: '',
    features: [
      { icon: 'zap', text: 'Avantage clé numéro 1' },
      { icon: 'heart', text: 'Avantage clé numéro 2' },
    ],
  },

  // ═══════════════════════════════════
  // TESTIMONIALS
  // ═══════════════════════════════════
  reviews: [
    { name: 'Thomas L.', rating: 5, text: 'Excellent produit, je recommande !', sport: 'Fitness', verified: true },
    { name: 'Camille D.', rating: 5, text: 'Très pratique au quotidien.', sport: 'Running', verified: true },
    { name: 'Lucas R.', rating: 4, text: 'Bonne qualité, livraison rapide.', sport: 'Musculation', verified: true },
  ],

  // ═══════════════════════════════════
  // FAQ
  // ═══════════════════════════════════
  faq: [
    { question: 'Combien de temps dure la livraison ?', answer: 'La livraison prend généralement entre 5 et 7 jours ouvrés en France métropolitaine.' },
    { question: 'Quels sont les moyens de paiement acceptés ?', answer: 'Nous acceptons Visa, Mastercard, CB, Apple Pay, Google Pay et Samsung Pay via notre partenaire Stripe.' },
    { question: 'Puis-je retourner le produit ?', answer: 'Oui, vous disposez de 30 jours après réception pour retourner le produit s\'il ne vous convient pas.' },
    { question: 'Comment contacter le service client ?', answer: 'Vous pouvez nous écrire à tout moment via notre adresse email. Nous répondons sous 24h.' },
  ],

  // ═══════════════════════════════════
  // SOCIAL MEDIA
  // ═══════════════════════════════════
  social: {
    instagram: '',
    tiktok: '',
    facebook: '',
    trustpilot: '',
  },

  // ═══════════════════════════════════
  // GUARANTEES
  // ═══════════════════════════════════
  guarantees: [
    { icon: 'truck', label: 'Livraison gratuite' },
    { icon: 'refresh', label: 'Retour 30 jours' },
    { icon: 'lock', label: 'Paiement sécurisé' },
    { icon: 'star', label: 'Service client FR' },
  ],

  // ═══════════════════════════════════
  // LEGAL
  // ═══════════════════════════════════
  legal: {
    companyName: 'Nom de la société',
    address: 'Adresse complète',
    director: 'Nom du directeur de publication',
    host: 'Vercel Inc. — San Francisco, CA',
  },

  // ═══════════════════════════════════
  // AGENCY CREDIT (optional)
  // ═══════════════════════════════════
  credit: {
    name: 'NMF Agence',
    url: 'https://www.nmf-agence.com',
  },
}

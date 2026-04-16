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
  storeName: 'PAWLY',
  storeUrl: 'https://pawly.shopping',
  contactEmail: 'contact@pawly.shopping',
  orderPrefix: 'PW',

  // ═══════════════════════════════════
  // PRODUCT
  // ═══════════════════════════════════
  product: {
    name: 'Pawly',
    tagline: 'Pommeau de douche pour chien et chat',
    description: 'Pawly est la douchette à pattes conçue pour les animaux de compagnie. Un pommeau de douche qui se branche en 5 secondes sur votre flexible pour laver les pattes boueuses de votre chien ou de votre chat sans stress, sans bain complet, sans lingettes. Jet doux, débit calibré pour les coussinets — adapté à toutes les races, du chiot au berger allemand, du chaton au maine coon. Fini les traces sur le canapé, les tapis et le parquet après chaque balade.',
    defaultPrice: 19.99,
    originalPrice: 30.00,
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
    headline: 'Des pattes propres en un jet',
    subheadline: 'Pawly se branche directement sur votre douche et nettoie les pattes de votre compagnon en quelques secondes — sans stress, sans bazar.',
    badge: '-33%',
    imageAlt: 'Pawly - Pommeau de douche pour laver les pattes de votre chien et de votre chat',
  },

  // ═══════════════════════════════════
  // BENEFITS (collapsible description)
  // ═══════════════════════════════════
  benefits: [
    { icon: 'bolt', title: 'Nettoyage express', description: 'Branchez, rincez, c\'est propre. Les pattes sont impeccables en quelques secondes.' },
    { icon: 'shield', title: 'Doux pour les coussinets', description: 'Jets souples et diffus, spécialement calibrés pour ne pas effrayer votre animal.' },
    { icon: 'link', title: 'Installation instantanée', description: 'Se branche directement sur n\'importe quel tuyau de douche standard, sans outil.' },
    { icon: 'gift', title: 'Facile à entretenir', description: 'Matériaux anti-calcaire, un simple rinçage suffit après chaque utilisation.' },
    { icon: 'phone', title: 'Chiens & chats', description: 'Adapté à toutes les tailles de pattes, du chihuahua au berger allemand.' },
    { icon: 'scale', title: 'Économique & écologique', description: 'Fini les lingettes jetables — Pawly utilise uniquement de l\'eau.' },
  ],

  // ═══════════════════════════════════
  // PROBLEMS / FEATURES SECTION
  // ═══════════════════════════════════
  problems: [
    { pain: 'Pattes boueuses après chaque balade', solution: 'Branchez Pawly sur votre douche et rincez les pattes en quelques jets — rapide, propre, sans éclabousser partout.', image: '/images/product/product-1.png', alt: 'Pawly rince les pattes boueuses sous la douche' },
    { pain: 'Traces sur le canapé, les tapis et le parquet', solution: 'Un passage sous Pawly avant de rentrer et votre intérieur reste impeccable, même les jours de pluie.', image: '/images/product/product-2.png', alt: 'Intérieur propre grâce à Pawly' },
    { pain: 'Bain complet à chaque retour de promenade', solution: 'Plus besoin de bain entier — Pawly cible uniquement les pattes avec un jet doux et précis.', image: '/images/product/product-3.png', alt: 'Nettoyage ciblé des pattes sans bain complet' },
    { pain: 'Lingettes jetables coûteuses et polluantes', solution: 'Pawly n\'utilise que de l\'eau. Zéro déchet, zéro produit chimique, zéro coût récurrent.', image: '/images/product/product-4.png', alt: 'Pawly solution écologique sans lingettes' },
  ],

  // ═══════════════════════════════════
  // EXPLANATION / VIDEO SECTION
  // ═══════════════════════════════════
  explanation: {
    title: 'Comment ça marche',
    subtitle: '3 étapes, un jet d\'eau, des pattes impeccables',
    videoSrc: '/images/product/product-video.mp4',
    features: [
      { icon: 'zap', text: 'Branchez Pawly sur votre tuyau de douche' },
      { icon: 'heart', text: 'Passez le jet doux sur les pattes de votre compagnon' },
      { icon: 'zap', text: 'Séchez et c\'est fini — propre en quelques secondes !' },
    ],
  },

  // ═══════════════════════════════════
  // TESTIMONIALS
  // ═══════════════════════════════════
  reviews: [
    { name: 'Sophie M.', rating: 5, text: 'Mon golden revient toujours couvert de boue. Depuis qu\'on a Pawly, plus aucune trace dans la maison. Indispensable !', sport: 'Golden Retriever', verified: true },
    { name: 'Marc T.', rating: 5, text: 'Super pratique et mon carlin n\'a aucun stress quand on l\'utilise. Le silicone est vraiment doux. Adopté !', sport: 'Carlin', verified: true },
    { name: 'Julie P.', rating: 5, text: 'Fini les serviettes mouillées partout dans l\'entrée. Je recommande à tous les propriétaires de chiens.', sport: 'Berger Australien', verified: true },
    { name: 'Antoine R.', rating: 4, text: 'Même notre chat se laisse faire ! Compact, facile à rincer. Très bon rapport qualité-prix.', sport: 'Chat Européen', verified: true },
    { name: 'Clara B.', rating: 5, text: 'On l\'emmène à chaque balade en forêt. Les pattes sont nickel en 10 secondes, même après la pluie.', sport: 'Labrador', verified: true },
  ],

  // ═══════════════════════════════════
  // FAQ
  // ═══════════════════════════════════
  faq: [
    { question: 'Pawly est-il adapté à toutes les tailles de chiens ?', answer: 'Oui ! Les poils en silicone souple s\'adaptent aussi bien aux petites pattes d\'un chihuahua qu\'aux grosses pattes d\'un labrador. Pawly convient également aux chats.' },
    { question: 'Comment entretenir Pawly ?', answer: 'Rien de plus simple : rincez le pommeau à l\'eau claire après utilisation. Les matériaux anti-calcaire facilitent l\'entretien au quotidien.' },
    { question: 'Combien de temps dure la livraison ?', answer: 'La livraison prend généralement entre 5 et 7 jours ouvrés en France métropolitaine. Livraison gratuite sur toutes les commandes.' },
    { question: 'Puis-je retourner Pawly si ça ne convient pas ?', answer: 'Bien sûr ! Vous disposez de 30 jours après réception pour retourner Pawly s\'il ne vous convient pas. Satisfait ou remboursé.' },
    { question: 'Quels sont les moyens de paiement acceptés ?', answer: 'Nous acceptons Visa, Mastercard, CB, Apple Pay, Google Pay et Samsung Pay via notre partenaire Stripe. Paiement 100% sécurisé.' },
    { question: 'Mon animal va-t-il se laisser faire ?', answer: 'Pawly diffuse un jet doux et silencieux, bien moins stressant qu\'une douche classique. La plupart des animaux s\'y habituent dès la première utilisation.' },
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

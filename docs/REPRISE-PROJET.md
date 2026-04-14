# Geestock - Reprise du Projet

> Document de reprise pour continuer le developpement sur un autre poste.
> Derniere mise a jour : 31 mars 2026
    
---

## 1. Presentation du projet

**Geestock** est un site e-commerce mono-produit (dropshipping) pour un sac magnetique pour bouteille.

- **Nom produit** : ClipBag (anciennement Geestock)
- **Produit** : Sac Magnetique pour Bouteille - 29,99 EUR (prix barre 49,99 EUR, -40%) — cout produit : 12 EUR
- **Domaine** : clipbag.shop (anciennement geestock.fr)
- **Packs** : Solo (29,99 EUR), Duo (49,99 EUR, -17%), Equipe (99,99 EUR, -33%)
- **Langue** : Francais uniquement
- **Domaine cible** : geestock.fr
- **Style** : Sport/Fitness moderne, theme sombre, couleur brand emerald (#10b981)

---

## 2. Stack technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Backend | NestJS | 11.x |
| Frontend | Nuxt 3 | 3.21.x |
| CSS | Tailwind CSS (via @nuxtjs/tailwindcss) | v3 (module v6.14) |
| State | Pinia | 3.x |
| ORM | Prisma | 7.5 (avec PrismaPg adapter) |
| BDD | PostgreSQL | 16 Alpine (Docker) |
| Paiement | Stripe (mode test) | SDK v20.4 |
| Auth | JWT (@nestjs/jwt) | 11.x |
| Securite | helmet, @nestjs/throttler, class-validator | |
| Tests backend | Jest | (34 tests, 7 fichiers) |
| Tests frontend | Vitest + Vue Test Utils + happy-dom | (10 tests, 3 fichiers) |
| Runtime | Node.js | v24+ (attention: commonjs obligatoire, pas nodenext) |

---

## 3. Architecture des fichiers

```
first-ecommerce-site/
├── docker-compose.yml          # PostgreSQL 16 Alpine (port 5433)
├── docs/
│   ├── REPRISE-PROJET.md       # Ce fichier
│   ├── plans/                  # Design docs et plans d'implementation
│   └── recommendations/        # Docs strategie (prix, ads, logistique, etc.)
│
├── backend/                    # NestJS API (port 3000, prefix /api)
│   ├── .env                    # Variables d'environnement (voir section 5)
│   ├── tsconfig.json           # IMPORTANT: module=commonjs, pas nodenext
│   ├── prisma/
│   │   ├── schema.prisma       # Schema BDD (Product, Order, OrderItem, Admin)
│   │   ├── migrations/         # Migrations SQL (indexing, tracking, orderNumber)
│   │   └── seed.ts             # Seed produit (images locales) + admin
│   ├── generated/prisma/       # Client Prisma genere (ne pas modifier)
│   └── src/
│       ├── main.ts             # Bootstrap: helmet, cors, validation, prefix /api, rawBody pour webhook
│       ├── app.module.ts       # Modules: Config, Throttler, Prisma, Products, Payments, Auth, Admin, Health, Tracking
│       ├── prisma/             # PrismaService (global)
│       ├── products/           # CRUD produit (GET /api/products, GET /api/products/:slug)
│       │   └── products.service.spec.ts  # 3 tests
│       ├── payments/           # Stripe checkout + webhook (raw body parsing)
│       │   ├── dto/create-checkout.dto.ts  # productId + quantity + sport (optionnel)
│       │   └── payments.service.spec.ts    # 6 tests
│       ├── auth/               # POST /api/auth/login (JWT)
│       │   ├── dto/login.dto.ts
│       │   ├── auth.service.spec.ts   # 3 tests
│       │   └── auth.guard.spec.ts     # 3 tests
│       ├── admin/              # CRUD admin (protege par AuthGuard JWT)
│       │   ├── dto/            # update-order-status, update-product, update-order-tracking, update-order-supplier
│       │   └── admin.service.spec.ts  # 12 tests
│       ├── tracking/           # Suivi commande public (POST /api/tracking/lookup)
│       │   ├── tracking.module.ts
│       │   ├── tracking.controller.ts
│       │   └── tracking.service.ts
│       └── health/             # GET /api/health (status + DB check)
│           └── health.controller.spec.ts  # 2 tests
│
└── frontend/                   # Nuxt 3 (port 4000)
    ├── nuxt.config.ts          # SEO, OG tags, route rules, Tailwind + Pinia modules, devServer port 4000
    ├── vitest.config.ts        # Configuration Vitest pour tests frontend
    ├── tailwind.config.ts      # Theme: brand (emerald), surface (dark), fonts (Inter + Montserrat)
    ├── app.vue                 # Layout + JSON-LD Product schema
    ├── composables/
    │   ├── useApi.ts           # Helper $fetch vers backend
    │   └── __tests__/useApi.spec.ts  # 3 tests
    ├── stores/
    │   ├── product.ts          # Store produit
    │   ├── cart.ts             # Store panier
    │   ├── auth.ts             # Store auth admin (JWT localStorage)
    │   └── __tests__/          # product.spec.ts (3 tests), auth.spec.ts (4 tests)
    ├── middleware/
    │   └── admin.ts            # Protection routes admin (redirect si non auth)
    ├── components/
    │   ├── SiteNavbar.vue      # Navbar flottante + mobile slide-in + lien "Suivre ma commande"
    │   ├── HeroSection.vue     # Hero mobile-first rewrite, gradient anime, wave underline, image centree mobile (product-7.png)
    │   ├── ProblemSection.vue  # Avant/Apres avec cartes gradient
    │   ├── FeaturesSection.vue # 3 colonnes, 6 features, hover glow
    │   ├── GallerySection.vue  # Galerie zoom, fleches, keyboard nav (images locales)
    │   ├── TestimonialsSection.vue  # Temoignages, carousel avec navigation + autoplay
    │   ├── SocialVideoSection.vue   # Carrousel 3D videos reseaux sociaux (TikTok/Instagram/YouTube) + autoplay
    │   ├── ExplanationSection.vue  # Section "Comment ca marche" avec video demo (clipbagPresentation.mp4)
    │   ├── OrderSection.vue    # Packs (Solo/Duo/Equipe) + question sport + 1-click checkout
    │   ├── LiveViewers.vue     # Widget "X personnes regardent ce produit"
    │   ├── PurchaseNotification.vue  # Toast fake "Thomas de Lyon vient de commander" (20s)
    │   ├── FaqSection.vue      # Accordion FAQ, 6 questions
    │   └── SiteFooter.vue      # 4 colonnes, paiement (Visa/MC/Stripe/ApplePay/GooglePay/SamsungPay), social, legal, JSON-LD Organization
    ├── pages/
    │   ├── index.vue           # Page principale (toutes les sections + notifications)
    │   ├── success.vue         # Page post-paiement (n° commande cliquable, lien suivi, bouton recommander)
    │   ├── cancel.vue          # Page annulation (bouton retour commande)
    │   ├── suivi.vue           # Page suivi commande (recherche par n° ou nom, multi-commandes, timeline)
    │   ├── mentions-legales.vue
    │   ├── cgv.vue
    │   ├── confidentialite.vue
    │   └── admin/
    │       ├── login.vue       # Login admin
    │       ├── index.vue       # Dashboard admin (stats, revenue, commandes recentes)
    │       ├── orders.vue      # Gestion commandes (onglets, workflow fournisseur/tracking, modal accessible)
    │       └── product.vue     # Edition produit (nom, description, prix, images, videos sociales, URL fournisseur)
    ├── tests/mocks/            # Mocks Nuxt pour Vitest (imports.ts, app.ts)
    └── public/
        ├── favicon.png         # Nouveau favicon PNG (remplace .ico)
        └── images/product/     # Images produit locales (product-1.jpg, product-2 a product-7.png, clipbagPresentation.mp4)
```

---

## 4. Schema de base de donnees (Prisma)

```prisma
model Product {
  id, name, slug (unique), description, price, comparePrice?, images[], variants (Json?), active, timestamps
  supplierUrl?
  → relation: OrderItem[]
}

model Order {
  id, orderNumber (unique, autoincrement), status (enum PENDING/PAID/PROCESSING/SHIPPED/DELIVERED/CANCELLED)
  customerEmail, customerName, customerPhone (default ""), shippingAddress (Json)
  total, stripeSessionId? (unique), stripePaymentId?
  trackingNumber?, trackingUrl?
  supplierOrderId?, supplierUrl?
  → relation: OrderItem[]
  → index: status, createdAt, customerEmail
}

model OrderItem {
  id, orderId, productId, quantity, price, variant?
  → index: orderId, productId
}

model Admin {
  id, email (unique), passwordHash, createdAt
}
```

---

## 5. Variables d'environnement (.env backend)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/geestock_dev"
STRIPE_SECRET_KEY="sk_test_..."               # Cle secrete Stripe
STRIPE_WEBHOOK_SECRET="whsec_..."             # stripe listen --forward-to localhost:3000/api/payments/webhook
STRIPE_PUBLISHABLE_KEY="pk_test_..."          # Cle publique Stripe
JWT_SECRET="dev-jwt-secret-change-in-prod"    # Changer en prod
FRONTEND_URL="http://localhost:4000"

# Admin credentials (seed)
ADMIN_EMAIL="admin@geestock.fr"
ADMIN_PASSWORD="admin123"
```

**Frontend** (`nuxt.config.ts` runtimeConfig) :
- `apiBase` = `http://localhost:3000/api`
- `siteUrl` = `https://geestock.fr`

---

## 6. Demarrage rapide (nouveau PC)

### Prerequis
- Node.js v24+ (ou v20+)
- Docker Desktop
- Git
- Stripe CLI (`choco install stripe-cli -y` sur Windows)

### Etapes

```bash
# 1. Cloner le repo
git clone <repo-url>
cd first-ecommerce-site

# 2. Lancer PostgreSQL (port 5433)
docker compose up -d
# Attendre que le healthcheck passe (pg_isready)

# 3. Backend (terminal 1)
cd backend
npm install
cp .env.example .env   # ou creer .env avec les valeurs de la section 5
npx prisma generate     # Generer le client Prisma
npx prisma migrate dev  # Appliquer les migrations
npx tsx prisma/seed.ts  # Seed: produit (images locales) + admin (admin@geestock.fr / admin123)
npm run start:dev       # Demarre sur http://localhost:3000

# 4. Verifier le backend
curl http://localhost:3000/api/health
# Doit retourner: {"status":"ok","database":"connected",...}

# 5. Frontend (terminal 2)
cd frontend
npm install
npm run dev             # Demarre sur http://localhost:4000

# 6. Stripe webhook (terminal 3) - necessaire pour recevoir les paiements
stripe login
stripe listen --forward-to localhost:3000/api/payments/webhook
# → Copier le whsec_... dans backend/.env (STRIPE_WEBHOOK_SECRET)
# → Redemarrer le backend

# 7. Lancer les tests
cd backend && npm test        # 104 tests Jest
cd frontend && npm run test:run  # 33 tests Vitest
```

> **Apres un git pull** : voir la section dediee dans `frontend/README.md` (npm install, prisma generate, prisma migrate dev, seed, tests).

---

## 7. Ports (dev)

| Service | Port |
|---------|------|
| Backend NestJS | 3000 |
| Frontend Nuxt | 4000 |
| PostgreSQL | 5433 |

---

## 8. Points d'API principaux

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | /api/health | Non | Health check + DB status |
| GET | /api/products | Non | Liste des produits actifs |
| GET | /api/products/:slug | Non | Detail produit par slug |
| POST | /api/payments/create-checkout | Non | Cree une session Stripe (body: `{productId, quantity, sport?}`) |
| POST | /api/payments/webhook | Non | Webhook Stripe (raw body + signature) |
| GET | /api/payments/session-status | Non | Statut d'une session Stripe (?session_id=) |
| POST | /api/tracking/lookup | Non | Recherche commande (body: `{orderNumber?}` ou `{name, email}`) |
| POST | /api/payments/cancel-order | Non | Annule une commande PENDING (body: `{session_id}`) |
| POST | /api/auth/login | Non | Login admin (body: `{email, password}`) → JWT |
| GET | /api/admin/dashboard | JWT | Stats: total commandes, revenue, commandes recentes |
| GET | /api/admin/orders | JWT | Liste des commandes paginee |
| PUT | /api/admin/orders/:id/status | JWT | Maj statut commande |
| PUT | /api/admin/orders/:id/tracking | JWT | Maj tracking (trackingNumber, trackingUrl) |
| PUT | /api/admin/orders/:id/supplier | JWT | Maj fournisseur (supplierOrderId, supplierUrl) |
| DELETE | /api/admin/orders/:id | JWT | Supprime une commande et ses items |
| GET | /api/admin/product | JWT | Detail produit (admin) |
| PUT | /api/admin/product/:id | JWT | Maj produit (nom, description, prix, images, supplierUrl) |

**Rate limiting** : 60 requetes / 60 secondes (global, ThrottlerGuard).

---

## 9. Fonctionnalites implementees

### Frontend
- [x] Landing page mono-produit, theme sombre premium
- [x] Sections: Hero, Probleme, Features, Galerie, Temoignages, Videos Sociales, Commande, FAQ, Footer
- [x] Navbar flottante avec liens ancre + menu mobile + lien "Suivre ma commande" (vert)
- [x] **Navigation cross-pages** : liens navbar fonctionnent depuis toutes les pages (redirect vers /#ancre)
- [x] **Packs prix degressifs** : Solo (29,99 EUR), Duo (49,99 EUR, -17%), Equipe (99,99 EUR, -33%)
- [x] **Question sport** avant checkout : Musculation, Running, Velo, Randonnee, Autre (optionnel, envoye dans metadata Stripe)
- [x] **1-click checkout** : pas de formulaire, Stripe gere l'adresse de livraison
- [x] **Widget "Live Viewers"** : "X personnes regardent ce produit" (3-15, mise a jour 30-60s)
- [x] **Notifications d'achat fake** : toast top-bar mobile (slide from top, 5s), bottom-left card desktop (25s rotation, 6s dismiss)
- [x] **Carrousel videos sociales 3D** : TikTok/Instagram/YouTube, perspective 3D, autoplay 3.5s, navigation circulaire infinie, plateforme auto-detectee
- [x] **Section Explication** : video demo produit (clipbagPresentation.mp4), play/pause au clic, design cinematique
- [x] Countdown timer (urgence)
- [x] Badge -40% sur l'image produit
- [x] Bouton CTA flottant mobile
- [x] Bouton "Decouvrir" (scroll vers section suivante)
- [x] Animations scroll (IntersectionObserver)
- [x] Pages legales : Mentions legales, CGV, Politique de confidentialite
- [x] **Page Success** : n° de commande unique (GS-00001), lien cliquable vers suivi, bouton "Commander a nouveau"
- [x] **Page Cancel** : bouton "Retour a la commande" vers /#order-section
- [x] **Page Suivi** (`/suivi`) : recherche par n° ou nom+email, multi-commandes avec pastille couleur, detail au clic, timeline animee, auto-recherche via ?order=
- [x] **Panel admin** : Login, Dashboard (stats + revenue), Commandes (detail modal accessible, filtres par onglets, workflow fournisseur/tracking, auto-status, suppression commande, telephone client cliquable), Edition produit (nom, description, prix, images, videos sociales, URL fournisseur)
- [x] **Page Cancel amelioree** : annulation automatique de la commande PENDING via session_id
- [x] **Workflow fournisseur AliExpress** : onglets (A commander / A expedier / Terminees), copie adresse client, lien AliExpress avec quantite auto, saisie n° commande, auto-avancement statut (PAID→PROCESSING→SHIPPED)
- [x] **Accessibilite modal** : role="dialog", aria-modal, aria-labelledby, fermeture Escape, labels lies aux inputs, cibles tactiles 44px+, feedback succes sur sauvegardes
- [x] Footer : icones paiement Visa, Mastercard, Stripe, Apple Pay, Google Pay, Samsung Pay
- [x] SEO : meta OG/Twitter, JSON-LD Product schema + FAQPage schema + Organization schema, canonical, robots.txt
- [x] Route rules : SWR caching, admin en CSR only
- [x] Gestion erreurs reseau (ERR_CONNECTION_REFUSED)
- [x] Images produit locales (plus de hotlinking AliExpress)

### Backend
- [x] API RESTful NestJS avec prefix /api
- [x] Prisma 7 + PrismaPg adapter + PostgreSQL Docker
- [x] Stripe Checkout Sessions avec shipping_address_collection (France)
- [x] **Webhook Stripe fonctionnel** : raw body parsing (bodyParser desactive pour /webhook), remplit customerEmail, customerName, shippingAddress
- [x] **Numero de commande unique** : orderNumber auto-incremente (GS-00001, GS-00002...)
- [x] **Suivi de commande** : module Tracking (POST /api/tracking/lookup), recherche par orderNumber ou nom+email, retourne toutes les commandes du client
- [x] **Tracking expedition** : champs trackingNumber et trackingUrl sur Order, endpoint admin PUT /orders/:id/tracking
- [x] **Sport dans metadata Stripe** : champ sport optionnel dans le checkout DTO
- [x] **Telephone client** : champ customerPhone sur Order, collecte via `phone_number_collection` Stripe
- [x] **Annulation commande** : endpoint POST /api/payments/cancel-order, auto-cancel des commandes PENDING depuis la page cancel
- [x] **Suppression commande admin** : endpoint DELETE /api/admin/orders/:id (supprime OrderItems + Order)
- [x] **Webhook ameliore** : re-fetch session complete, fallback multiple sources pour adresse (collected_information → shipping_details → customer_details), billing_address_collection required
- [x] **Codes promo Stripe** : `allow_promotion_codes: true` dans la session checkout
- [x] Auth JWT pour le panel admin
- [x] Admin : gestion images produit + mise a jour produit complete (dont supplierUrl)
- [x] **Fournisseur** : champs supplierOrderId + supplierUrl sur Order, supplierUrl sur Product, endpoint PUT /orders/:id/supplier
- [x] Validation DTO (class-validator, whitelist, forbidNonWhitelisted)
- [x] Securite : helmet, CORS configure (FRONTEND_URL), rate limiting (60/60s)
- [x] Health endpoint avec check DB
- [x] Indexes DB sur Order et OrderItem

### Tests (44 tests, 100% pass)
- [x] Backend Jest : payments (6), auth service (3), auth guard (3), admin (12), products (3), health (2), DTO supplier (4)
- [x] Frontend Vitest : product store (3), auth store (4), useApi composable (3)

---

## 10. Identifiants par defaut (dev)

| Service | Identifiant | Mot de passe |
|---------|------------|--------------|
| PostgreSQL | postgres | postgres |
| Admin panel | admin@geestock.fr | admin123 |
| Stripe test card | 4242 4242 4242 4242 | Date future, CVC quelconque |

---

## 11. Decisions techniques importantes

### tsconfig.json du backend
**CRITIQUE** : Utiliser `"module": "commonjs"` et `"moduleResolution": "node"`. Le mode `"nodenext"` cause un crash Prisma 7 sur Node.js v24 (`ReferenceError: exports is not defined in ES module scope`).

### Prisma 7
- Provider = `prisma-client` (pas `prisma-client-js`)
- Pas de `url` dans `datasource db` (la connexion passe par l'adapter PrismaPg)
- Output genere dans `../generated/prisma` (relatif au fichier schema)
- Import : `from '../../generated/prisma/client'` (sans extension `.js` dans le code source)

### 1-click Checkout (Stripe)
- Le frontend envoie `productId` + `quantity` + `sport` (optionnel)
- Une commande PENDING est creee cote backend avec un `orderNumber` auto-incremente et des champs client vides
- Stripe collecte l'adresse via `shipping_address_collection: { allowed_countries: ['FR'] }`
- Le webhook `checkout.session.completed` remplit les infos client (email, nom, adresse) et passe le statut a PAID

### Webhook Stripe (raw body)
- `bodyParser: false` dans `NestFactory.create`
- `express.raw({ type: 'application/json' })` pour la route `/api/payments/webhook` uniquement
- `express.json()` et `express.urlencoded()` pour toutes les autres routes
- Le `req.body` est un Buffer dans le controller webhook, passe directement a `stripe.webhooks.constructEvent`

### Stripe en local (dev)
- Installer Stripe CLI : `choco install stripe-cli -y` (Windows)
- `stripe login` puis `stripe listen --forward-to localhost:3000/api/payments/webhook`
- Le `whsec_...` affiche doit etre mis dans `.env` → `STRIPE_WEBHOOK_SECRET`
- En prod : configurer le webhook dans dashboard.stripe.com → Developers → Webhooks → URL: `https://geestock.fr/api/payments/webhook`

### Videos sociales (admin)
- Les videos sont stockees en `localStorage` (cle `geestock_social_videos`), pas en BDD
- Le composant `SocialVideoSection` lit depuis localStorage au montage
- Le panel admin produit permet d'ajouter/supprimer des videos (URL + titre + miniature)
- La plateforme (TikTok/Instagram/YouTube) est auto-detectee depuis l'URL
- Pour YouTube : miniature auto-generee depuis l'ID video

### Demarrage du backend compile
Le build NestJS sort dans `dist/src/main.js` (pas `dist/main.js`).
```bash
npx nest build && node dist/src/main.js
```

---

## 12. Ce qu'il reste a faire

- [x] ~~Remplacer les cles Stripe placeholder par de vraies cles test~~
- [x] ~~Configurer le webhook Stripe en local~~
- [x] ~~Tester le parcours complet : Commander → Stripe → Success page~~
- [x] ~~Images produit en local ou CDN (actuellement AliExpress)~~
- [x] ~~Tests unitaires~~
- [ ] Emails transactionnels (confirmation de commande, expedition)
- [ ] Integration WhatsApp post-achat (lien wa.me sur page success)
- [ ] Systeme de parrainage (code referral, reduction pour parrain + filleul)
- [ ] Deploiement (VPS, Vercel, Railway, etc.)
- [ ] Nom de domaine + SSL
- [ ] Analytics (GA4, Meta Pixel) — voir `docs/strategie-pub-meta-ads.md`
- [ ] Tests E2E (Playwright)
- [ ] Migrer les videos sociales de localStorage vers la BDD
- [x] ~~Ajouter champs fournisseur dans schema Prisma + admin (supplierOrderId, supplierUrl sur Order, supplierUrl sur Product)~~
- [ ] Integration suivi colis tiers (Ship24 / Track123 / 17track)
- [x] ~~Refonte section video sociale : carousel 3D cinematique mobile/desktop~~

---

## 13. Journal des sessions de travail

### 26 mars 2026

**Section video sociale (`SocialVideoSection.vue`)** — exploration UX/UI :
- Ajout d'une scrollbar custom stylee brand (emerald) dans `main.css` (classe `.scrollbar-brand`)
- Tentative carousel tube 3D mobile : carte active au centre, cartes adjacentes en profondeur avec `perspective`, `translateZ`, `rotateY`, fils de suspension simulant un tube
- Tentative d'unification du carousel tube pour desktop et mobile
- Suppression de la card conteneur grise (`bg-surface-light`) pour integration au fond du site
- Sortie des badges plateforme (Instagram/TikTok/YouTube) au-dessus du carousel avec connecteur vert vertical
- **Decision** : reset de la section puis refonte complete avec une approche cinematique

**Refonte finale — carousel 3D cinematique (valide)** :
- Carousel 3D unifie mobile/desktop avec `perspective: 1000px` et `transform-style: preserve-3d`
- Carte active au centre avec glow emerald (`box-shadow` + `ring` brand), cartes adjacentes reculees en profondeur (`translateZ`), pivotees (`rotateY`), reduites (`scale`) et assombries (`brightness filter`)
- Badges plateforme (Instagram/TikTok/YouTube) integres au header, fond transparent (`bg-white/[0.04]`)
- Pas de card conteneur, les videos flottent directement sur le fond sombre du site
- Titre de la video en overlay dans la carte (gradient noir en bas)
- Tailles responsive via `clamp()` CSS (pas de breakpoint JS)
- Navigation : swipe tactile, fleches, clavier (gauche/droite), dots cliquables, navigation circulaire
- Accessibilite : `role="region"`, `aria-roledescription="carousel"`, `tabindex`, `aria-hidden` sur cartes inactives
- `prefers-reduced-motion` respecte
- Demarre sur la 4eme video (index 3)
- Styles isoles via `<style scoped>`

**Fichiers modifies** :
- `frontend/assets/css/main.css` — ajout classe `.scrollbar-brand` (conserve)
- `frontend/components/SocialVideoSection.vue` — refonte complete

### 27 mars 2026

**Strategie publicitaire Meta Ads** :
- Redaction de `docs/strategie-pub-meta-ads.md` : strategie complete Meta Ads (budget 250EUR/mois, structure campagnes, creatifs photo, protocole de test, metriques/seuils, plan de scaling)
- Mise a jour cout produit a 12EUR (marge avant pub ~14EUR, CPA max ~7EUR, ~36 ventes/mois pour rentabilite)

**SEO — schema Organization** :
- Ajout JSON-LD Organization dans `SiteFooter.vue` (nom, url, logo, contactPoint email, langue francaise, sameAs pret pour liens sociaux)
- Audit SEO : score 9-10/10 — FAQPage schema et h1 sur suivi.vue deja presents

**Image produit hero** :
- Nouvelle image renommee `product-7.png` (anciennement fichier ChatGPT)
- `HeroSection.vue` utilise product-7.png comme visuel principal (aspect-square + object-cover)
- `OrderSection.vue` : suppression du scale-90 sur l'image produit, ajout `object-[center_30%]` pour cadrage optimal

**Fichiers modifies** :
- `docs/strategie-pub-meta-ads.md` — nouveau fichier strategie pub
- `docs/REPRISE-PROJET.md` — mise a jour
- `frontend/components/SiteFooter.vue` — ajout JSON-LD Organization
- `frontend/components/HeroSection.vue` — nouvelle image hero product-7.png
- `frontend/components/OrderSection.vue` — cadrage image produit
- `frontend/public/images/product/product-7.png` — nouvelle image produit

### 27-30 mars 2026 (autre poste)

**Rebranding Geestock → ClipBag** :
- Renommage du produit et de la marque dans tout le code (seed, SEO, videos, localStorage key `clipbag_social_videos`)
- Nouveau domaine : `clipbag.shop` (remplace `geestock.fr`)
- URLs canoniques et OG tags mis a jour

**Nouvelle section ExplanationSection** :
- Section "Comment ca marche" avec video demo produit (`clipbagPresentation.mp4`, 15 Mo)
- Slogan "Clip ton Bag", design cinematique avec glow brand et border animee
- Placee entre Hero et ProblemSection dans le flux de page

**Refonte HeroSection (mobile-first)** :
- Rewrite complet du layout mobile : badges → titre → IMAGE → prix → CTA (image au centre au lieu d'etre enterree en bas)
- Texte gradient anime + effet wave underline sur le titre
- Trust indicators en grille 3 colonnes sur mobile (plus de debordement)
- Badge note positionne dans les limites de l'image
- Image produit cappee a 280px mobile, 300px tablette
- Tighter spacing sur tous les elements mobiles
- Bouton Decouvrir centre avec `inset-x-0`

**Refonte TestimonialsSection** :
- Layout carousel avec navigation et styling ameliores
- Autoplay integre

**PurchaseNotification redesign** :
- Mobile : slim top banner (slide from top, auto-dismiss 5s), ne couvre plus le CTA flottant
- Desktop : bottom-left card (inchange)
- Delai 3s avant premiere notification, rotation 25s

**GallerySection** :
- Auto-play 4s avec pause on hover/zoom
- Reset timer sur navigation manuelle
- Fond sombre restaure (images formats inconsistants)

**SocialVideoSection** :
- Navigation circulaire infinie (wrap-around positioning)
- Autoplay 3.5s avec reset on interaction

**DevOps & cleanup** :
- Scripts `build` et `start:prod` corriges dans `backend/package.json`
- Error handling SSR pour le fetch produit (try/catch + retry client)
- Nouveau favicon PNG (remplace .ico)
- Docs HTML (secrets deploiement) retires du git tracking (`.gitignore`)
- Meta Pixel integre (`useMetaPixel` composable, `ViewContent` event sur index)

**Fichiers modifies** :
- `frontend/components/ExplanationSection.vue` — nouveau composant
- `frontend/components/HeroSection.vue` — refonte mobile-first
- `frontend/components/TestimonialsSection.vue` — refonte carousel
- `frontend/components/PurchaseNotification.vue` — redesign toast
- `frontend/components/GallerySection.vue` — autoplay + fond sombre
- `frontend/components/SocialVideoSection.vue` — autoplay + infinite loop
- `frontend/pages/index.vue` — ajout ExplanationSection + Meta Pixel
- `frontend/public/favicon.png` — nouveau favicon
- `frontend/public/images/product/clipbagPresentation.mp4` — video demo
- `backend/package.json` — fix scripts prod
- `backend/prisma/seed.ts` — rebranding ClipBag
- `.gitignore` — exclusion docs HTML

### 30 mars 2026

**Telephone client + collecte d'infos Stripe amelioree** :
- Ajout champ `customerPhone` sur le modele Order (migration Prisma)
- Activation `phone_number_collection`, `billing_address_collection: 'required'`, `customer_creation: 'always'` et `allow_promotion_codes: true` dans la session Stripe checkout
- Webhook ameliore : re-fetch de la session complete via `sessions.retrieve`, fallback multiple sources pour l'adresse de livraison (`collected_information` → `shipping_details` → `customer_details`), logging debug

**Annulation de commande** :
- Nouveau endpoint `POST /api/payments/cancel-order` : annule automatiquement les commandes PENDING quand l'utilisateur arrive sur `/cancel`
- Page cancel mise a jour : envoie le `session_id` au backend pour annuler la commande
- URL cancel Stripe mise a jour avec `?session_id={CHECKOUT_SESSION_ID}`

**Suppression de commande (admin)** :
- Nouveau endpoint `DELETE /api/admin/orders/:id` (protege JWT) : supprime les OrderItems puis la commande
- Bouton de suppression dans la modal commande admin (confirmation requise, style rouge discret)

**Admin orders — telephone client** :
- Affichage du telephone client dans la modal commande avec lien `tel:` cliquable

**Fichiers modifies** :
- `backend/prisma/schema.prisma` — ajout `customerPhone`
- `backend/prisma/migrations/` — nouvelle migration
- `backend/src/payments/payments.service.ts` — refonte webhook, cancel order, options Stripe
- `backend/src/payments/payments.controller.ts` — endpoint cancel-order
- `backend/src/payments/payments.service.spec.ts` — maj tests
- `backend/src/admin/admin.service.ts` — deleteOrder
- `backend/src/admin/admin.controller.ts` — endpoint DELETE orders/:id
- `frontend/pages/admin/orders.vue` — telephone, suppression commande
- `frontend/pages/cancel.vue` — annulation auto via session_id

---

## 14. Lien commandes site / commandes fournisseur (AliExpress)


### Etat actuel : workflow semi-automatique implemente

Le systeme gere maintenant un workflow complet de commande fournisseur :
- `supplierOrderId` / `supplierUrl` sur Order — n° et lien de commande AliExpress
- `supplierUrl` sur Product — lien produit AliExpress (URL de confirmation avec quantite dynamique)
- `trackingNumber` / `trackingUrl` — numero et lien de suivi colis
- Auto-avancement statut : saisie n° fournisseur → PROCESSING, saisie tracking → SHIPPED
- Onglets dans l'admin : A commander, A expedier, Terminees (avec compteurs badge)
- Copie adresse client en un clic, lien direct AliExpress avec quantite pre-remplie

### API AliExpress : analyse (25 mars 2026)

**Faisable techniquement** (API Dropshipping permet de passer des commandes), **mais pas recommande** pour notre cas :

| Probleme | Detail |
|----------|--------|
| Inscription entreprise obligatoire | Certificat immatriculation, TVA, piece d'identite |
| Pas de SDK Node.js officiel | SDK communautaires non maintenus uniquement |
| Documentation mediocre | Noms de methodes qui changent, formats inconsistants |
| Paiement pas totalement automatisable | Compte AliExpress approvisionne requis |
| Migration recente | Passage Taobao → AliExpress Open Platform, integrations cassees |
| Effort disproportionne | Pour un site solo/petit volume, le dev > le gain de temps |

### Alternatives evaluees

| Solution | Verdict |
|----------|---------|
| **CJ Dropshipping API** | API REST bien documentee, compatible NestJS, mais produit non disponible chez CJ |
| **DSers** | Plugin Shopify/WooCommerce uniquement, pas d'API standalone pour site custom NestJS |
| **API AliExpress directe** | Trop complexe pour le volume actuel |

### Decision : workflow semi-automatique (implemente)

**Fait** : champs fournisseur ajoutes (supplierOrderId, supplierUrl sur Order, supplierUrl sur Product), workflow en 2 etapes dans l'admin modal, auto-avancement des statuts, onglets de filtrage, copie adresse, lien AliExpress dynamique.

**Pre-remplissage adresse AliExpress** : non faisable via URL. Alternatives evaluees : extension Chrome (fragile), DS API (acces restreint), DSers (Shopify only). Solution actuelle : copie adresse dans le presse-papier.

**Moyen terme (si volume justifie)** : integrer un service de suivi colis tiers (Ship24, Track123, 17track) pour automatiser les mises a jour de statut.

---

## 15. Documents de strategie disponibles

Les documents suivants sont dans `docs/recommendations/` :
- `pricing-strategy.md` — Strategie de prix et promotions
- `ads-strategy.md` — Strategie publicitaire (Meta, Google, TikTok)
- `supplier-logistics.md` — Fournisseurs et logistique
- `product-innovation.md` — Idees d'innovation produit
- `testing-strategy.md` — Strategie de tests
- `devops-checklist.md` — Checklist DevOps et deploiement

Le document `docs/strategie-pub-meta-ads.md` contient la strategie Meta Ads (budget 250EUR/mois, structure campagnes, creatifs, protocole de test, metriques, scaling).
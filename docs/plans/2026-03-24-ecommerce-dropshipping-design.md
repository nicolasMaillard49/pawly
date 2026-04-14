# Design — Site Dropshipping Mono-Produit

## Produit
**Sac magnétique pour bouteille d'eau** — Geestock Fitness
Accessoire sport/outdoor avec fixation magnétique. Variantes de couleurs.

Source AliExpress: Product ID 1005010051187117

### Images produit
- https://ae01.alicdn.com/kf/Sb3f10763c9c948c7a9bdc6e84a6e9a0fe.jpg
- https://ae01.alicdn.com/kf/S12e824863ec645dea0aef595f904c0eaf.jpg
- https://ae01.alicdn.com/kf/S4d8bac28c4794424a382b37bf383cac4d.jpg
- https://ae01.alicdn.com/kf/Scb8b59e6be9442c292b42251f3afd438u.jpg
- https://ae01.alicdn.com/kf/Sc9f337cce8ce48f199695e18ca515bbcH.jpg
- https://ae01.alicdn.com/kf/S3841ddcdd72d4eac91362fc44339f0a34.jpg

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌──────────┐
│   Nuxt 3 (SSR)  │ ───► │  NestJS API     │ ───► │ PostgreSQL│
│   Vue 3 + Pinia │      │  Prisma ORM     │      │  (Prisma) │
│   Tailwind CSS  │      │  Stripe SDK     │      └──────────┘
└─────────────────┘      └─────────────────┘
```

## Frontend (Nuxt 3)

### Landing Page (/)
Page unique scrollable :
1. **Hero** — Image plein écran, titre accrocheur, CTA "Commander"
2. **Problème/Solution** — Pourquoi ce produit existe
3. **Caractéristiques** — 3-4 features avec icônes
4. **Galerie produit** — Carrousel des 6 images
5. **Témoignages** — Avis clients statiques
6. **Section achat** — Sélection couleur, quantité, prix, bouton Stripe
7. **FAQ** — Accordéon
8. **Footer** — Mentions légales, contact

### Pages additionnelles
- `/success` — Confirmation de commande
- `/cancel` — Annulation de paiement
- `/admin` — Panel d'administration (protégé)
- `/admin/login` — Login admin

### Style
- Fond sombre (#0a0a0a)
- Accent vert émeraude (#10b981)
- Typographie Inter / Montserrat
- Stack: Nuxt 3, Vue 3 Composition API, Tailwind CSS, Pinia

## Backend (NestJS)

### Modules
- `products` — CRUD produit (pré-seedé)
- `orders` — Gestion commandes
- `payments` — Stripe Checkout Sessions (mode test)
- `auth` — JWT pour admin
- `admin` — Dashboard, gestion commandes/produit
- `mailer` — Placeholder pour emails transactionnels (implémentation prod)
- `config` — Variables d'environnement

### Stripe Flow
1. Client clique "Commander"
2. Backend crée une Stripe Checkout Session
3. Redirect vers Stripe hosted checkout
4. Webhook Stripe → mise à jour commande
5. Redirect vers /success ou /cancel

### Base de données (PostgreSQL + Prisma)
- Product: id, name, description, price, images[], variants[]
- Order: id, status, customerEmail, customerName, address, items, total, stripeSessionId
- Admin: id, email, passwordHash

## Panel Admin
- Dashboard: commandes récentes, revenus
- Liste des commandes avec statuts
- Gestion produit (modifier prix, description, images)
- Login JWT

## Hors scope MVP
- Emails transactionnels (prévu pour prod)
- Gestion de stock
- Multi-langue
- Analytics

## Langue
Français uniquement

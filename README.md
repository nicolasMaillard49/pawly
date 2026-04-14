# Dropshipping Template

Template e-commerce dropshipping prêt à l'emploi. Changez de produit en modifiant un seul fichier.

## Stack

- **Frontend** : Nuxt 3 + Vue 3 + Tailwind CSS → Vercel
- **Backend** : NestJS + Prisma → Railway
- **Database** : PostgreSQL (Railway)
- **Paiement** : Stripe
- **Emails** : Resend
- **Analytics** : Meta Pixel + GA4

## Démarrage rapide

### 1. Cloner et installer

```bash
git clone <repo-url> mon-store
cd mon-store

# Backend
cd backend && npm install && npx prisma generate && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2. Configurer le produit

Modifiez **un seul fichier** : `frontend/config/store.config.ts`

- Nom du store, URL, email de contact
- Produit : nom, prix, description
- Thème : couleurs, police
- Contenu : hero, bénéfices, FAQ, avis, features
- Réseaux sociaux, mentions légales

### 3. Ajouter les images

Placez vos images dans `frontend/public/images/product/` :

| Fichier | Usage |
|---------|-------|
| `product-1.jpg` à `product-7.jpg` | Carrousel produit (ordre admin) |
| `presentation.mp4` | Vidéo explicative |
| `feature-1.jpg` à `feature-4.jpg` | Section problèmes/solutions |
| `og.png` | Image Open Graph (1200x630) |
| `favicon.png` | Favicon |

### 4. Variables d'environnement

#### Backend (`.env`)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/dropshipping_dev
JWT_SECRET=votre-secret-jwt
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
EMAIL_FROM=Mon Store <contact@monstore.shop>
ADMIN_EMAIL=admin@monstore.shop
STORE_NAME=Mon Store
STORE_URL=https://monstore.shop
CONTACT_EMAIL=contact@monstore.shop
ORDER_PREFIX=MS
```

#### Frontend (`.env`)

```env
NUXT_PUBLIC_API_BASE=http://localhost:3000/api
NUXT_PUBLIC_SITE_URL=https://monstore.shop
NUXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

### 5. Lancer en local

```bash
# Terminal 1 : Base de données
docker-compose up -d

# Terminal 2 : Backend
cd backend && npm run start:dev

# Terminal 3 : Frontend
cd frontend && npm run dev
```

### 6. Seed de la base

```bash
cd backend && npx prisma migrate deploy && npx prisma db seed
```

## Déploiement

### Vercel (Frontend)

1. Connecter le repo GitHub
2. Root directory : `frontend`
3. Variables d'env : `NUXT_PUBLIC_API_BASE`, `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_STRIPE_PUBLIC_KEY`

### Railway (Backend)

1. Connecter le repo GitHub
2. Root directory : `backend`
3. Variables d'env : toutes celles du `.env` backend
4. Ajouter un service PostgreSQL

### Stripe Webhook (local)

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

## Changer de thème

Modifiez `theme` dans `store.config.ts` :

```ts
theme: {
  primary: '#a9f955',      // Couleur CTA
  primaryHover: '#9be84a',  // Hover CTA
  secondary: '#da3024',     // Accent
  background: '#ffffff',    // Fond
  surfaceDark: '#080808',   // Footer/navbar
  text: '#101010',          // Texte
  font: 'Inter',            // Police
}
```

## Structure

```
frontend/
  config/store.config.ts  ← TOUT SE CONFIGURE ICI
  components/             ← Composants génériques
  pages/                  ← Pages (index, suivi, legal...)
  public/images/product/  ← Images produit
backend/
  src/config/store.config.ts ← Config backend (env vars)
  src/email/templates/    ← Templates emails
  prisma/                 ← Schema + migrations + seed
```

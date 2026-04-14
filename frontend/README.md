# ClipBag - Frontend

Nuxt 3 + Vue 3 + Tailwind CSS frontend pour le site e-commerce ClipBag.

## Setup

```bash
npm install
```

## Developpement

```bash
# Lancer le serveur de dev (port 4000)
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tests

```bash
npm run test:run    # 33 tests Vitest (une seule passe)
npm run test        # Mode watch
```

## Variables d'environnement

Copier `.env.example` en `.env` et adapter les valeurs.

| Variable | Description | Defaut |
|----------|-------------|--------|
| `NUXT_PUBLIC_API_BASE` | URL de l'API backend | `http://localhost:3000/api` |
| `NUXT_PUBLIC_SITE_URL` | URL publique du site | `https://clipbag.shop` |

---

## Apres un git pull

A executer **a chaque fois** apres un `git pull` pour s'assurer que tout est synchronise :

```bash
# 1. S'assurer que PostgreSQL tourne
cd ..
docker compose up -d

# 2. Backend — deps + Prisma + migrations
cd backend
npm install                   # Nouvelles deps si package.json a change
npx prisma generate           # Regenere le client Prisma (obligatoire si schema.prisma a change)
npx prisma migrate dev        # Applique les nouvelles migrations SQL
npx tsx prisma/seed.ts        # Re-seed si le seed a ete modifie (idempotent)

# 3. Frontend — deps
cd ../frontend
npm install                   # Nouvelles deps si package.json a change

# 4. Verifier que tout fonctionne
cd ../backend
node node_modules/jest/bin/jest.js          # 104 tests backend
cd ../frontend
node node_modules/vitest/vitest.mjs run     # 33 tests frontend

# 5. Relancer les serveurs de dev
# Terminal 1 : cd backend && npm run start:dev
# Terminal 2 : cd frontend && npm run dev
# Terminal 3 : stripe listen --forward-to localhost:3000/api/payments/webhook
```

### Quand chaque etape est-elle necessaire ?

| Etape | Quand |
|-------|-------|
| `npm install` | Un `package.json` a change (nouveau dep, version bump) |
| `npx prisma generate` | Le fichier `schema.prisma` a change (nouveau champ, nouveau modele) |
| `npx prisma migrate dev` | Un fichier apparait dans `backend/prisma/migrations/` |
| `npx tsx prisma/seed.ts` | Le seed a ete modifie (nouvelles images, prix, nom produit) |
| Relancer `stripe listen` | Le `whsec_...` a change ou la session a expire |

> **En cas de doute, executez toutes les etapes.** Ca prend 30 secondes et evite les bugs de desynchronisation.

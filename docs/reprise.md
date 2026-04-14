# Reprise — Migration ClipBag → Template Générique

**Date** : 14 avril 2026
**Source** : `first-ecommerce-site` (ClipBag)
**Destination** : `dropshipping-template`

---

## Objectif

Extraire tout ce qui est générique du projet e-commerce ClipBag pour créer un template dropshipping réutilisable, sans aucune trace du produit actuel.

---

## Ce qui a été fait

### 1. Copie du projet

- Copie complète de `first-ecommerce-site` via `tar` (sans `node_modules`, `.nuxt`, `dist`, `.git`)
- Nouveau repo git initialisé

### 2. Fichier de configuration centralisé

**`frontend/config/store.config.ts`** — Interface TypeScript stricte (`StoreConfig`) contenant :
- Identité (nom store, URL, email, préfixe commande)
- Produit (nom, tagline, description, prix, devise, délai livraison)
- Thème (couleurs, police)
- Hero section
- Bénéfices produit (liste dynamique)
- Problèmes/solutions (liste dynamique)
- Section explication (titre, vidéo, features)
- Avis clients (liste dynamique)
- FAQ (liste dynamique)
- Réseaux sociaux
- Garanties/réassurances
- Mentions légales
- Crédit agence (optionnel)

**`backend/src/config/store.config.ts`** — Config backend lue depuis les variables d'environnement :
- `STORE_NAME`, `STORE_URL`, `CONTACT_EMAIL`, `ORDER_PREFIX`
- Fonction utilitaire `formatOrderNumber()` pour le préfixe dynamique

### 3. Nettoyage frontend — Composants (9 fichiers)

| Fichier | Modifications |
|---------|--------------|
| `HeroSection.vue` | Alt images, fallbacks prix/nom, bénéfices en `v-for` sur `storeConfig.benefits`, lien Trustpilot dynamique |
| `FaqSection.vue` | FAQ en `v-for` sur `storeConfig.faq`, email contact dynamique |
| `TestimonialsSection.vue` | 13 avis hardcodés → `storeConfig.reviews` avec computed |
| `ProblemSection.vue` | 4 features hardcodées → `storeConfig.problems` en boucle, aria-label et CTA dynamiques |
| `ExplanationSection.vue` | Titre, vidéo, features → `storeConfig.explanation` |
| `SiteNavbar.vue` | `CLIPBAG` → `storeConfig.storeName` |
| `SiteFooter.vue` | Nom, description, email, crédit agence (conditionnel), copyright dynamique, structured data |
| `PurchaseNotification.vue` | Nom produit dynamique |
| `layouts/admin.vue` | Deux instances `CLIPBAG` → `storeConfig.storeName` |

### 4. Nettoyage frontend — Pages (18 fichiers)

| Fichier | Modifications |
|---------|--------------|
| `nuxt.config.ts` | SEO générique, suppression Meta Pixel/GA4 hardcodés, `siteUrl` via env var |
| `app.vue` | Structured data dynamique (nom, prix, devise, URL) |
| `pages/index.vue` | SEO title/description/og via storeConfig |
| `pages/suivi.vue` | Préfixe commande dynamique, SEO dynamique |
| `pages/success.vue` | Préfixe commande dynamique, titre dynamique |
| `pages/cancel.vue` | Titre et email contact dynamiques |
| `pages/cgv.vue` | Toutes refs ClipBag/clipbag.shop → storeConfig |
| `pages/mentions-legales.vue` | Société, adresse, directeur, hébergeur → `storeConfig.legal` |
| `pages/confidentialite.vue` | Nom store et email dynamiques |
| `pages/admin/login.vue` | Nom store dynamique, placeholder email générique |
| `pages/admin/orders.vue` | Préfixe commande dynamique |
| `pages/admin/bundles.vue` | Placeholder générique |
| `pages/admin/product.vue` | `clipbag_social_videos` → `store_social_videos` |
| `pages/admin/index.vue` | `clipbag_profit_config` → `store_profit_config` |
| `public/robots.txt` | Suppression sitemap hardcodé |
| `public/og-generator.html` | Placeholders génériques |
| `tests/mocks/imports.ts` | URL localhost |
| `README.md` | Réécrit en guide template générique |

### 5. Nettoyage backend (12 fichiers)

| Fichier | Modifications |
|---------|--------------|
| `email.service.ts` | Import `storeConfig`/`formatOrderNumber`, email from dynamique, préfixe commande, URL admin dashboard |
| `templates/order-confirmation.ts` | Accepte `StoreInfo` en paramètre (storeName, storeUrl, orderNum) |
| `templates/shipping-notification.ts` | Idem — plus aucun hardcodé |
| `prisma/seed.ts` | Slug générique, noms produit/bundle génériques, email admin générique, DB name `dropshipping_dev` |
| `prisma.service.ts` | `geestock_dev` → `dropshipping_dev` |
| `.env.example` | Nouvelles variables `STORE_NAME`, `STORE_URL`, `CONTACT_EMAIL`, `ORDER_PREFIX` |
| `bundles.service.spec.ts` | `ClipBag` → `Mon Produit` |
| `payments.service.spec.ts` | `ClipBag` → `Mon Produit` |
| `update-product.dto.spec.ts` | `ClipBag` → `Mon Produit` |

### 6. Nettoyage infrastructure (3 fichiers)

| Fichier | Modifications |
|---------|--------------|
| `docker-compose.yml` | `geestock-postgres` → `store-postgres`, `geestock_dev` → `dropshipping_dev` |
| `package.json` (racine) | `geestock-dropshipping` → `dropshipping-template` |
| `.github/workflows/ci.yml` | `geestock_test` → `dropshipping_test` |

### 7. Suppressions

- `docs/clipbag-creatifs.html`, `clipbag-deploiement.html`, `clipbag-setup-guide.html`
- `docs/strategie-pub-meta-ads.md`
- `docs/plans/`, `docs/recommendations/`, `docs/superpowers/`
- `docs/REPRISE-PROJET.md`
- `.claude/` (config spécifique au projet source)
- `skills/` (skills spécifiques au projet source)

### 8. Documentation

- `README.md` — Guide complet (setup, config, déploiement, personnalisation thème)
- `frontend/public/images/product/README.md` — Structure images attendue

---

## Vérification

Grep final sur tout le codebase (`.ts`, `.vue`, `.json`, `.html`, `.txt`, `.yml`, `.md`) :
- **0 occurrence** de `clipbag`, `geestock`, `sac magn`

---

## Comment utiliser le template

1. Copier le dossier
2. Modifier `frontend/config/store.config.ts` (produit, thème, contenu)
3. Ajouter les images dans `frontend/public/images/product/`
4. Configurer les variables d'environnement (backend + frontend)
5. `npm install` dans `backend/` et `frontend/`
6. Déployer frontend sur Vercel, backend sur Railway

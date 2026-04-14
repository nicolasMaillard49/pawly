# Bundles Premium — Design Spec

**Date:** 2026-04-09
**Statut:** Approuve
**Objectif:** Permettre la vente de packs multi-produits (ClipBag + accessoires) avec gestion complete depuis l'admin.

## Contexte

ClipBag vend un produit unique (29.99 EUR). Les packs actuels (Duo 2x, Equipe 5x) sont hardcodes dans le code (PACK_CONFIG backend + tableau packs[] frontend). On veut ajouter des packs premium avec accessoires (Shaker, Elastique, Serviette) et rendre le tout gerant depuis l'admin sans redeploiement.

**Logistique:** Chaque accessoire est commande separement sur AliExpress. Les bundles sont un concept de vente, pas d'expedition groupee.

## Packs prevus

| Pack | Contenu | Prix | Compare Price | Badge |
|------|---------|------|---------------|-------|
| Solo | 1x ClipBag | 29.99 EUR | 49.99 EUR | - |
| Sport | ClipBag + Shaker | 34.99 EUR | 69.99 EUR | -50% |
| Kit Complet | ClipBag + Shaker + Elastique + Serviette | 49.99 EUR | 99.99 EUR | -50% |
| Duo | 2x ClipBag | 49.99 EUR | 99.98 EUR | -50% |
| Equipe | 5x ClipBag | 99.99 EUR | 249.95 EUR | -60% |

"Solo" n'est pas un bundle — c'est l'achat par defaut sans bundle selectionne.

## 1. Schema DB (Prisma)

### Nouveaux modeles

```prisma
model Bundle {
  id           String       @id @default(uuid())
  slug         String       @unique
  label        String
  description  String       @default("")
  price        Float
  comparePrice Float?
  badge        String?
  position     Int          @default(0)
  active       Boolean      @default(true)
  items        BundleItem[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model BundleItem {
  id        String  @id @default(uuid())
  bundleId  String
  bundle    Bundle  @relation(fields: [bundleId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int     @default(1)

  @@index([bundleId])
}
```

### Modifications modeles existants

**Product** — ajouter relation:
```prisma
bundleItems BundleItem[]
```

**OrderItem** — ajouter champ:
```prisma
bundleSlug String?
```

### Seed

Creer les produits accessoires (avec `active: false` pour ne pas apparaitre cote client):
- Shaker (costPrice, supplierUrl a renseigner)
- Elastique (costPrice, supplierUrl a renseigner)
- Serviette (costPrice, supplierUrl a renseigner)

Creer les 4 bundles avec leurs BundleItems.

## 2. API Backend

### Nouveaux endpoints

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | /api/bundles | Public | Bundles actifs, tries par position, avec items + produit |
| GET | /api/admin/bundles | JWT | Tous les bundles (actifs + inactifs) avec items + produit |
| POST | /api/admin/bundles | JWT | Creer un bundle avec ses items |
| PUT | /api/admin/bundles/:id | JWT | Modifier bundle (label, prix, badge, active, position, items) |
| DELETE | /api/admin/bundles/:id | JWT | Supprimer un bundle |

### Nouveau module NestJS

`BundlesModule` avec `BundlesController` + `BundlesService`. Le controller public est separe du controller admin (ou routes dans AdminController existant).

### Modification checkout

**DTO `CreateCheckoutDto`:**
- Remplacer `packType?: string` par `bundleId?: string` (UUID, optionnel)
- Garder `productId` + `quantity` pour l'achat solo

**Flow avec bundle:**
1. Front envoie `{ productId, quantity: 1, bundleId: "uuid" }`
2. Backend fetch le bundle + items depuis DB
3. Valide `bundle.active === true`
4. Utilise `bundle.price` comme total (securite: jamais le prix du front)
5. Cree l'Order avec un `OrderItem` par produit du bundle, chacun avec `bundleSlug`
6. Stripe: un seul line_item avec `name: bundle.label`, `unit_amount: bundle.price * 100`

**Flow sans bundle (solo):**
- Inchange: `productId` + `quantity`, prix = `product.price * quantity`

### Suppression de PACK_CONFIG

Le fichier `payments.service.ts` n'a plus de `PACK_CONFIG` hardcode. Toute la logique pack passe par la DB.

### Impact email confirmation

L'email liste deja `order.items`. Avec les bundles, chaque article s'affiche naturellement. On ajoute le nom du bundle en en-tete quand `bundleSlug` est present sur les items.

## 3. Admin UI

### Nouvelle page `/admin/bundles`

**Liste (vue par defaut):**
- Cartes triees par `position`
- Chaque carte: label + badge + prix (barre si comparePrice) + statut actif/inactif (toggle) + liste items + boutons modifier/supprimer
- Bouton "Creer un pack" en haut

**Formulaire edition (modale ou page):**
- label (texte)
- slug (texte, auto-genere depuis label)
- price (nombre)
- comparePrice (nombre, optionnel)
- badge (texte, optionnel)
- position (nombre)
- active (toggle)
- Section "Contenu du pack":
  - Lignes dynamiques: select produit (tous les Product en DB) + quantite
  - Bouton ajouter/supprimer par ligne
  - Affichage cout total achat (somme costPrice * qty) + marge en temps reel

### Modification page commandes (detail)

Quand les OrderItems ont un `bundleSlug`:
- En-tete groupe: "Pack Kit Complet" avec prix total
- En dessous: chaque article avec nom + quantite + lien cliquable "Commander chez fournisseur" (product.supplierUrl)

### Navigation admin

Ajouter "Packs" dans le sidebar entre "Produit" et "Commandes".

## 4. Frontend Client

### Chargement des bundles

Ajouter `fetchBundles()` dans le store product (ou nouveau store). Appele via `useAsyncData` en parallele du produit sur la page index.

### Affichage packs (HeroSection)

Remplacer le tableau hardcode `packs[]` par les donnees de la DB. Rendu visuel identique (boutons radio).

Ordre d'affichage:
1. Solo (pas un bundle, toujours present = achat par defaut)
2. Bundles actifs tries par `position`

### Logique quantite

- Bundle selectionne: quantite verrouillee a 1 (grisee, pas de +/-)
- Pas de bundle: selecteur +/- normal pour achat solo

### Logique prix

- Total = `bundle.price` si bundle, sinon `product.price * quantity`
- Barre = `bundle.comparePrice` si bundle, sinon `product.comparePrice * quantity`
- Economie = barre - total

### Checkout

- Bundle: `{ productId, quantity: 1, bundleId: "uuid" }`
- Solo: `{ productId, quantity }` (pas de bundleId)

### Meta Pixel

Le tracking AddToCart / InitiateCheckout envoie le `content_name` du bundle quand un pack est selectionne.

## 5. Migration des donnees existantes

Les commandes passees avec l'ancien systeme (packType "duo", "equipe") restent intactes — le champ `bundleSlug` est nullable, les anciennes commandes auront `null`. Pas de migration de donnees, juste le schema.

Le `PACK_CONFIG` hardcode et le champ DTO `packType` sont supprimes. Le frontend n'envoie plus `packType`.

## 6. Tests

### Backend
- BundlesService: CRUD bundles, validation
- PaymentsService: checkout avec bundleId, checkout sans bundle, bundle inactif (400), bundle inexistant (404)
- DTO: validation bundleId optionnel

### Frontend
- Store: fetchBundles
- HeroSection: selection bundle, verrouillage quantite, calcul prix

# Stratégie de Tests - Geestock

## Pyramide de tests recommandée

### Backend (NestJS)

#### Tests unitaires (70%)
- Services : `ProductsService`, `PaymentsService`, `AdminService`, `AuthService`
- Guards : `AuthGuard`
- DTOs : validation avec class-validator

```bash
# Lancer les tests
cd backend && npm test
```

#### Tests d'intégration (20%)
- Endpoints API avec Supertest
- Flow de checkout complet (mock Stripe)
- Authentification login -> token -> accès admin

#### Tests E2E (10%)
- Checkout flow complet (Stripe test mode)
- Admin login + gestion commandes

### Frontend (Nuxt 3)

#### Tests à mettre en place
- **Vitest** pour tests unitaires des composables et stores
- **Vue Testing Library** pour tests de composants
- **Playwright** ou **Cypress** pour E2E

```bash
# Installation recommandée
cd frontend
npm install -D vitest @vue/test-utils @testing-library/vue happy-dom
```

## Priorités de test (MVP)

### P0 - Critique (avant mise en prod)
1. Le checkout Stripe fonctionne (test E2E avec sk_test)
2. Le webhook Stripe met à jour le statut de commande
3. L'authentification admin fonctionne
4. Les validations DTO rejettent les données invalides

### P1 - Important (première semaine)
5. La page produit affiche les bonnes informations
6. Le sélecteur de couleur/quantité fonctionne
7. Les pages légales s'affichent correctement
8. Le dashboard admin affiche les bonnes stats

### P2 - Nice to have
9. Tests de performance (Lighthouse CI)
10. Tests visuels (Percy ou Chromatic)
11. Tests de charge (K6 sur les endpoints critiques)

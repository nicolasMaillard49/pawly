# DevOps Checklist - Geestock

## Avant mise en production

### Infrastructure
- [ ] Hébergement choisi (recommandé : Railway, Render, ou VPS OVH/Scaleway)
- [ ] Nom de domaine geestock.fr configuré
- [ ] Certificat SSL/TLS actif (HTTPS obligatoire)
- [ ] DNS configuré (A record + CNAME www)

### Base de données
- [ ] PostgreSQL en service managé (pas de Docker en prod)
- [ ] Backups automatiques quotidiens
- [ ] Tester la restauration de backup
- [ ] Connection pooling configuré (PgBouncer si nécessaire)

### Backend
- [ ] Variables d'environnement en prod :
  - `DATABASE_URL` : URL PostgreSQL de production
  - `JWT_SECRET` : clé secrète longue et aléatoire (>32 chars)
  - `STRIPE_SECRET_KEY` : clé live Stripe (sk_live_xxx)
  - `STRIPE_WEBHOOK_SECRET` : secret webhook production
  - `FRONTEND_URL` : https://geestock.fr
  - `NODE_ENV` : production
- [ ] Dockerfile multi-stage pour le backend
- [ ] Health check endpoint `/api/health` fonctionnel
- [ ] Logs structurés (JSON) vers un service de monitoring

### Frontend
- [ ] Build SSR (pas SPA) pour le SEO
- [ ] `NUXT_PUBLIC_API_BASE` : URL API de production
- [ ] Images optimisées (considérer un CDN)
- [ ] Lighthouse score > 90 sur toutes les métriques

### Stripe
- [ ] Passer des clés test aux clés live
- [ ] Configurer le webhook production dans le dashboard Stripe
- [ ] Tester une transaction réelle avec un montant minimal
- [ ] Configurer les emails de reçu Stripe

### Monitoring
- [ ] Sentry (ou équivalent) pour le tracking d'erreurs
- [ ] Uptime monitoring (UptimeRobot, Better Uptime)
- [ ] Alertes sur erreurs 500 et timeouts

### Sécurité
- [ ] Headers de sécurité (helmet) activés
- [ ] Rate limiting configuré
- [ ] CORS restrictif (uniquement le domaine de prod)
- [ ] Pas de secrets dans le code source
- [ ] Dépendances à jour (`npm audit`)

## Docker en production (optionnel)

```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/package.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

## CI/CD recommandé

### GitHub Actions (simple)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd backend && npm ci && npm run build
      - run: cd frontend && npm ci && npm run build
      # Déployer selon l'hébergeur choisi
```

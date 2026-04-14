# Dropshipping Template - Frontend

Nuxt 3 + Vue 3 + Tailwind CSS frontend for a single-product dropshipping store.

All store-specific values (name, URL, product info, legal, theme) are configured in `config/store.config.ts`.

## Setup

```bash
npm install
```

## Development

```bash
# Start the dev server (port 4000)
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tests

```bash
npm run test:run    # Vitest (single pass)
npm run test        # Watch mode
```

## Environment variables

Copy `.env.example` to `.env` and adjust values.

| Variable | Description | Default |
|----------|-------------|---------|
| `NUXT_PUBLIC_API_BASE` | Backend API URL | `http://localhost:3000/api` |
| `NUXT_PUBLIC_SITE_URL` | Public site URL | `http://localhost:4000` |
| `NUXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID (optional) | `` |

## Store configuration

Edit `frontend/config/store.config.ts` to customise:

- Store identity (name, URL, contact email, order prefix)
- Product info (name, tagline, description, prices)
- Analytics IDs (Meta Pixel, GA4)
- Theme colours and font
- Hero, benefits, problems, explanation, testimonials, FAQ sections
- Social links and guarantees
- Legal information (company name, address, director, host)

---

## After a git pull

Run these steps after every `git pull` to stay in sync:

```bash
# 1. Ensure PostgreSQL is running
cd ..
docker compose up -d

# 2. Backend — deps + Prisma + migrations
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts

# 3. Frontend — deps
cd ../frontend
npm install

# 4. Verify everything works
cd ../backend
node node_modules/jest/bin/jest.js
cd ../frontend
node node_modules/vitest/vitest.mjs run

# 5. Start dev servers
# Terminal 1: cd backend && npm run start:dev
# Terminal 2: cd frontend && npm run dev
# Terminal 3: stripe listen --forward-to localhost:3000/api/payments/webhook
```

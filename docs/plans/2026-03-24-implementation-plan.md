# Dropshipping E-Commerce Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mono-product dropshipping site selling Geestock magnetic water bottle bags, with Stripe test mode payments, NestJS backend, Nuxt 3 frontend, and admin panel.

**Architecture:** Monorepo with `backend/` (NestJS + Prisma + PostgreSQL) and `frontend/` (Nuxt 3 + Tailwind CSS). Stripe Checkout Sessions for payments. JWT auth for admin. API-first design with REST endpoints.

**Tech Stack:** NestJS 10, Prisma, PostgreSQL, Stripe SDK, Nuxt 3, Vue 3 Composition API, Tailwind CSS, Pinia, JWT

---

### Task 1: Project Scaffolding & Git Init

**Files:**
- Create: `backend/` (NestJS project)
- Create: `frontend/` (Nuxt 3 project)
- Create: `.gitignore`
- Create: `package.json` (root workspace)

**Step 1: Initialize git repo**

```bash
cd D:/Users/user1/Documents/DEV/first-ecommerce-site
git init
```

**Step 2: Create root package.json for monorepo**

Create `package.json`:
```json
{
  "name": "geestock-dropshipping",
  "private": true,
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "dev:backend": "cd backend && npm run start:dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
  }
}
```

**Step 3: Create .gitignore**

```
node_modules/
dist/
.nuxt/
.output/
.env
*.local
.DS_Store
```

**Step 4: Scaffold NestJS backend**

```bash
npx @nestjs/cli new backend --package-manager npm --skip-git
```

**Step 5: Scaffold Nuxt 3 frontend**

```bash
npx nuxi init frontend
cd frontend && npm install
```

**Step 6: Install root dev dependencies**

```bash
npm install -D concurrently --workspace-root
```

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold monorepo with NestJS backend and Nuxt 3 frontend"
```

---

### Task 2: Backend — Prisma & Database Setup

**Files:**
- Create: `backend/prisma/schema.prisma`
- Create: `backend/.env`
- Modify: `backend/package.json`

**Step 1: Install Prisma in backend**

```bash
cd backend
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

**Step 2: Write Prisma schema**

File: `backend/prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String
  price       Float
  comparePrice Float?
  images      String[]
  variants    Json?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orders      OrderItem[]
}

model Order {
  id              String      @id @default(uuid())
  status          OrderStatus @default(PENDING)
  customerEmail   String
  customerName    String
  shippingAddress Json
  items           OrderItem[]
  total           Float
  stripeSessionId String?     @unique
  stripePaymentId String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
  variant   String?
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model Admin {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

**Step 3: Configure .env**

File: `backend/.env`
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/geestock_dev"
STRIPE_SECRET_KEY="sk_test_PLACEHOLDER"
STRIPE_WEBHOOK_SECRET="whsec_PLACEHOLDER"
JWT_SECRET="dev-jwt-secret-change-in-prod"
FRONTEND_URL="http://localhost:3000"
```

**Step 4: Create Prisma service module**

File: `backend/src/prisma/prisma.service.ts`
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

File: `backend/src/prisma/prisma.module.ts`
```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**Step 5: Run migration**

```bash
npx prisma migrate dev --name init
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat(backend): add Prisma schema with Product, Order, Admin models"
```

---

### Task 3: Backend — Product Module & Seed

**Files:**
- Create: `backend/src/products/products.module.ts`
- Create: `backend/src/products/products.service.ts`
- Create: `backend/src/products/products.controller.ts`
- Create: `backend/src/products/dto/`
- Create: `backend/prisma/seed.ts`

**Step 1: Generate products module**

```bash
cd backend
npx nest g module products
npx nest g service products
npx nest g controller products
```

**Step 2: Write products service**

File: `backend/src/products/products.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({ where: { active: true } });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findUnique({ where: { slug } });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }
}
```

**Step 3: Write products controller**

File: `backend/src/products/products.controller.ts`
```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
```

**Step 4: Write seed script**

File: `backend/prisma/seed.ts`
```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed product
  await prisma.product.upsert({
    where: { slug: 'geestock-magnetic-bottle-bag' },
    update: {},
    create: {
      name: 'Geestock Sac Magnétique pour Bouteille',
      slug: 'geestock-magnetic-bottle-bag',
      description: 'Le sac magnétique révolutionnaire pour vos bouteilles d\'eau. Conçu pour les sportifs et aventuriers, il se fixe instantanément grâce à sa technologie magnétique puissante. Libérez vos mains pendant vos séances de sport, randonnées ou déplacements quotidiens.',
      price: 29.99,
      comparePrice: 49.99,
      images: [
        'https://ae01.alicdn.com/kf/Sb3f10763c9c948c7a9bdc6e84a6e9a0fe.jpg',
        'https://ae01.alicdn.com/kf/S12e824863ec645dea0aef595f904c0eaf.jpg',
        'https://ae01.alicdn.com/kf/S4d8bac28c4794424a382b37bf383cac4d.jpg',
        'https://ae01.alicdn.com/kf/Scb8b59e6be9442c292b42251f3afd438u.jpg',
        'https://ae01.alicdn.com/kf/Sc9f337cce8ce48f199695e18ca515bbcH.jpg',
        'https://ae01.alicdn.com/kf/S3841ddcdd72d4eac91362fc44339f0a34.jpg',
      ],
      variants: {
        colors: [
          { name: 'Noir', value: 'black' },
          { name: 'Bleu', value: 'blue' },
          { name: 'Vert', value: 'green' },
          { name: 'Rouge', value: 'red' },
        ],
      },
      active: true,
    },
  });

  // Seed admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@geestock.fr' },
    update: {},
    create: {
      email: 'admin@geestock.fr',
      passwordHash,
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Step 5: Add seed script to package.json and install bcrypt**

```bash
npm install bcrypt
npm install -D @types/bcrypt ts-node
```

Add to `backend/package.json`:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

**Step 6: Run seed**

```bash
npx prisma db seed
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat(backend): add products module and seed data"
```

---

### Task 4: Backend — Stripe Payments Module

**Files:**
- Create: `backend/src/payments/payments.module.ts`
- Create: `backend/src/payments/payments.service.ts`
- Create: `backend/src/payments/payments.controller.ts`
- Create: `backend/src/payments/dto/create-checkout.dto.ts`

**Step 1: Install Stripe**

```bash
cd backend
npm install stripe
```

**Step 2: Write checkout DTO**

File: `backend/src/payments/dto/create-checkout.dto.ts`
```typescript
export class CreateCheckoutDto {
  productId: string;
  quantity: number;
  variant?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
```

**Step 3: Write payments service**

File: `backend/src/payments/payments.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createCheckoutSession(dto: CreateCheckoutDto) {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id: dto.productId },
    });

    const order = await this.prisma.order.create({
      data: {
        customerEmail: dto.customerEmail,
        customerName: dto.customerName,
        shippingAddress: dto.shippingAddress,
        total: product.price * dto.quantity,
        items: {
          create: {
            productId: product.id,
            quantity: dto.quantity,
            price: product.price,
            variant: dto.variant,
          },
        },
      },
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: dto.customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
              images: [product.images[0]],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: dto.quantity,
        },
      ],
      metadata: { orderId: order.id },
      success_url: `${this.configService.get('FRONTEND_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/cancel`,
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get('STRIPE_WEBHOOK_SECRET'),
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.prisma.order.update({
        where: { stripeSessionId: session.id },
        data: {
          status: 'PAID',
          stripePaymentId: session.payment_intent as string,
        },
      });
    }

    return { received: true };
  }

  async getSessionStatus(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    const order = await this.prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: { items: { include: { product: true } } },
    });
    return { session, order };
  }
}
```

**Step 4: Write payments controller**

File: `backend/src/payments/payments.controller.ts`
```typescript
import { Controller, Post, Body, Headers, Req, RawBodyRequest, Get, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-checkout')
  createCheckout(@Body() dto: CreateCheckoutDto) {
    return this.paymentsService.createCheckoutSession(dto);
  }

  @Post('webhook')
  webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(req.rawBody, signature);
  }

  @Get('session-status')
  getSessionStatus(@Query('session_id') sessionId: string) {
    return this.paymentsService.getSessionStatus(sessionId);
  }
}
```

**Step 5: Write payments module**

File: `backend/src/payments/payments.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
```

**Step 6: Enable rawBody in main.ts for Stripe webhooks**

Modify `backend/src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  });
  app.setGlobalPrefix('api');
  await app.listen(3001);
}
bootstrap();
```

**Step 7: Register all modules in AppModule**

Modify `backend/src/app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProductsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
```

Install ConfigModule:
```bash
npm install @nestjs/config
```

**Step 8: Commit**

```bash
git add -A
git commit -m "feat(backend): add Stripe payments with checkout sessions and webhooks"
```

---

### Task 5: Backend — Auth & Admin Module

**Files:**
- Create: `backend/src/auth/auth.module.ts`
- Create: `backend/src/auth/auth.service.ts`
- Create: `backend/src/auth/auth.controller.ts`
- Create: `backend/src/auth/auth.guard.ts`
- Create: `backend/src/admin/admin.module.ts`
- Create: `backend/src/admin/admin.controller.ts`
- Create: `backend/src/admin/admin.service.ts`

**Step 1: Install JWT dependencies**

```bash
cd backend
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
```

**Step 2: Write auth service**

File: `backend/src/auth/auth.service.ts`
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    const token = this.jwtService.sign({ sub: admin.id, email: admin.email });
    return { access_token: token };
  }
}
```

**Step 3: Write auth guard**

File: `backend/src/auth/auth.guard.ts`
```typescript
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      request['admin'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

**Step 4: Write auth controller & module**

File: `backend/src/auth/auth.controller.ts`
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
```

File: `backend/src/auth/auth.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
```

**Step 5: Write admin service & controller**

File: `backend/src/admin/admin.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const totalOrders = await this.prisma.order.count();
    const paidOrders = await this.prisma.order.count({ where: { status: 'PAID' } });
    const totalRevenue = await this.prisma.order.aggregate({
      where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
      _sum: { total: true },
    });
    const recentOrders = await this.prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });

    return {
      totalOrders,
      paidOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
    };
  }

  async getOrders(page = 1, limit = 20) {
    const orders = await this.prisma.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });
    const total = await this.prisma.order.count();
    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateOrderStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async updateProduct(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async getProduct() {
    return this.prisma.product.findFirst();
  }
}
```

File: `backend/src/admin/admin.controller.ts`
```typescript
import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('orders')
  getOrders(@Query('page') page: string) {
    return this.adminService.getOrders(Number(page) || 1);
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateOrderStatus(id, status);
  }

  @Get('product')
  getProduct() {
    return this.adminService.getProduct();
  }

  @Put('product/:id')
  updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateProduct(id, data);
  }
}
```

File: `backend/src/admin/admin.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
```

**Step 6: Register Auth & Admin in AppModule**

Add imports for `AuthModule` and `AdminModule` in `app.module.ts`.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat(backend): add JWT auth and admin panel API"
```

---

### Task 6: Frontend — Nuxt 3 Setup with Tailwind CSS

**Files:**
- Modify: `frontend/nuxt.config.ts`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/assets/css/main.css`
- Create: `frontend/composables/useApi.ts`
- Create: `frontend/stores/product.ts`
- Create: `frontend/stores/cart.ts`

**Step 1: Install Tailwind CSS and dependencies**

```bash
cd frontend
npm install -D @nuxtjs/tailwindcss
npm install @pinia/nuxt pinia
```

**Step 2: Configure nuxt.config.ts**

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3001/api',
    },
  },
  app: {
    head: {
      title: 'Geestock - Sac Magnétique pour Bouteille',
      meta: [
        { name: 'description', content: 'Le sac magnétique révolutionnaire pour vos bouteilles d\'eau. Libérez vos mains pendant le sport.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@700;800;900&display=swap' },
      ],
    },
  },
})
```

**Step 3: Create Tailwind config**

File: `frontend/tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        surface: {
          DEFAULT: '#0a0a0a',
          light: '#171717',
          lighter: '#262626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
    },
  },
} satisfies Config
```

**Step 4: Create global CSS**

File: `frontend/assets/css/main.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface text-white;
  }

  ::selection {
    @apply bg-brand/30;
  }
}
```

**Step 5: Create API composable**

File: `frontend/composables/useApi.ts`
```typescript
export const useApi = () => {
  const config = useRuntimeConfig()

  const apiFetch = async <T>(path: string, options?: any): Promise<T> => {
    return await $fetch<T>(`${config.public.apiBase}${path}`, options)
  }

  return { apiFetch }
}
```

**Step 6: Create Pinia stores**

File: `frontend/stores/product.ts`
```typescript
import { defineStore } from 'pinia'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  images: string[]
  variants: { colors: { name: string; value: string }[] } | null
}

export const useProductStore = defineStore('product', {
  state: () => ({
    product: null as Product | null,
    loading: false,
  }),
  actions: {
    async fetchProduct() {
      this.loading = true
      const { apiFetch } = useApi()
      try {
        const products = await apiFetch<Product[]>('/products')
        this.product = products[0] || null
      } finally {
        this.loading = false
      }
    },
  },
})
```

File: `frontend/stores/cart.ts`
```typescript
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    quantity: 1,
    selectedColor: 'black',
  }),
  actions: {
    setQuantity(qty: number) {
      this.quantity = Math.max(1, Math.min(10, qty))
    },
    setColor(color: string) {
      this.selectedColor = color
    },
  },
})
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat(frontend): setup Nuxt 3 with Tailwind CSS, Pinia stores, API composable"
```

---

### Task 7: Frontend — Landing Page Components

**Files:**
- Create: `frontend/components/HeroSection.vue`
- Create: `frontend/components/ProblemSection.vue`
- Create: `frontend/components/FeaturesSection.vue`
- Create: `frontend/components/GallerySection.vue`
- Create: `frontend/components/TestimonialsSection.vue`
- Create: `frontend/components/OrderSection.vue`
- Create: `frontend/components/FaqSection.vue`
- Create: `frontend/components/SiteFooter.vue`
- Create: `frontend/components/SiteNavbar.vue`
- Modify: `frontend/app.vue`
- Create: `frontend/pages/index.vue`
- Create: `frontend/layouts/default.vue`

This is the largest task. Each component implements a section of the landing page with the sport/fitness dark theme.

**Key design tokens:**
- Background: `bg-surface` (#0a0a0a), cards: `bg-surface-light` (#171717)
- Accent: `text-brand` (#10b981), hover: `hover:bg-brand-dark`
- Headlines: `font-display font-black`
- Body: `font-sans`
- Smooth scroll between sections
- Responsive mobile-first

All components follow the dark sport/fitness theme with green accent. Complete Vue 3 Composition API with `<script setup>`.

**Step 1: Create all components** (see design doc for visual reference)

Each component is a full-width section. The OrderSection includes color picker, quantity selector, customer form, and Stripe checkout button.

**Step 2: Create layout and pages**

`frontend/layouts/default.vue` wraps with Navbar + Footer.
`frontend/pages/index.vue` composes all sections.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(frontend): add all landing page sections with dark sport theme"
```

---

### Task 8: Frontend — Checkout Flow & Success/Cancel Pages

**Files:**
- Create: `frontend/pages/success.vue`
- Create: `frontend/pages/cancel.vue`
- Modify: `frontend/components/OrderSection.vue` (add checkout logic)

**Step 1: Add checkout logic to OrderSection**

On form submit: POST to `/api/payments/create-checkout`, then redirect to Stripe Checkout URL.

**Step 2: Create success page**

Fetches session status from `/api/payments/session-status` and displays order confirmation.

**Step 3: Create cancel page**

Simple page with "Retour à l'accueil" button.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat(frontend): add checkout flow with Stripe redirect, success and cancel pages"
```

---

### Task 9: Frontend — Admin Panel

**Files:**
- Create: `frontend/pages/admin/login.vue`
- Create: `frontend/pages/admin/index.vue`
- Create: `frontend/pages/admin/orders.vue`
- Create: `frontend/pages/admin/product.vue`
- Create: `frontend/stores/auth.ts`
- Create: `frontend/middleware/auth.ts`
- Create: `frontend/layouts/admin.vue`

**Step 1: Create auth store**

Manages JWT token, login/logout, persists to localStorage.

**Step 2: Create auth middleware**

Redirects to `/admin/login` if no valid token.

**Step 3: Create admin layout**

Sidebar with navigation: Dashboard, Commandes, Produit.

**Step 4: Create admin pages**

- Login: email/password form
- Dashboard: stats cards + recent orders table
- Orders: paginated table with status dropdown
- Product: edit form for name, description, price, images

**Step 5: Commit**

```bash
git add -A
git commit -m "feat(frontend): add admin panel with dashboard, orders management, product editing"
```

---

### Task 10: Integration Testing & Polish

**Step 1: Test full flow**

```bash
# Terminal 1: Start backend
cd backend && npm run start:dev

# Terminal 2: Start frontend
cd frontend && npm run dev
```

**Step 2: Verify endpoints**

- GET http://localhost:3001/api/products
- POST http://localhost:3001/api/auth/login
- GET http://localhost:3001/api/admin/dashboard (with JWT)

**Step 3: Test Stripe checkout flow**

Use Stripe test card: 4242 4242 4242 4242

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: polish and integration testing"
```

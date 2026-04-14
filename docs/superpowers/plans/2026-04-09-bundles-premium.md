# Bundles Premium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded PACK_CONFIG with DB-driven bundles supporting multi-product packs (ClipBag + accessories), manageable from the admin panel.

**Architecture:** New Prisma models (Bundle, BundleItem) + NestJS BundlesModule for public/admin CRUD + modified checkout flow reading bundle price from DB + admin UI for bundle management + frontend dynamic bundle loading.

**Tech Stack:** Nuxt 3, NestJS 11, Prisma 7, PostgreSQL, Tailwind CSS, Stripe, Vitest (frontend), Jest (backend)

---

### Task 1: Prisma Schema — Add Bundle and BundleItem models

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1: Add Bundle and BundleItem models + modify Product and OrderItem**

In `backend/prisma/schema.prisma`, add before the `enum OrderStatus` block:

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

In the existing `Product` model, add the relation field after `orders OrderItem[]`:

```prisma
bundleItems BundleItem[]
```

In the existing `OrderItem` model, add after `variant String?`:

```prisma
bundleSlug String?
```

- [ ] **Step 2: Generate and run migration**

Run:
```bash
cd backend && npx prisma migrate dev --name add-bundles
```

Expected: Migration created successfully, Prisma Client regenerated.

- [ ] **Step 3: Commit**

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations/
git commit -m "feat(db): add Bundle and BundleItem models, bundleSlug on OrderItem"
```

---

### Task 2: Seed accessory products and bundles

**Files:**
- Modify: `backend/prisma/seed.ts`

- [ ] **Step 1: Add accessory products and bundles to seed**

Replace the entire content of `backend/prisma/seed.ts` with:

```typescript
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5433/geestock_dev';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed main product
  const clipbag = await prisma.product.upsert({
    where: { slug: 'clipbag-magnetic-bottle-bag' },
    update: {
      images: [
        '/images/product/product-1.png',
        '/images/product/product-2.png',
        '/images/product/product-3.png',
        '/images/product/product-4.png',
        '/images/product/product-5.png',
        '/images/product/product-6.png',
      ],
    },
    create: {
      name: 'ClipBag - Sac Magnétique pour Bouteille',
      slug: 'clipbag-magnetic-bottle-bag',
      description:
        "Le sac magnétique révolutionnaire pour vos bouteilles d'eau. Conçu pour les sportifs et aventuriers, il se fixe instantanément grâce à sa technologie magnétique puissante. Libérez vos mains pendant vos séances de sport, randonnées ou déplacements quotidiens.",
      price: 29.99,
      comparePrice: 49.99,
      costPrice: 0,
      images: [
        '/images/product/product-1.png',
        '/images/product/product-2.png',
        '/images/product/product-3.png',
        '/images/product/product-4.png',
        '/images/product/product-5.png',
        '/images/product/product-6.png',
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

  // Seed accessory products (active: false — not sold individually)
  const shaker = await prisma.product.upsert({
    where: { slug: 'shaker-sport' },
    update: {},
    create: {
      name: 'Shaker Sport',
      slug: 'shaker-sport',
      description: 'Shaker sport inclus dans les packs premium.',
      price: 0,
      costPrice: 0,
      images: [],
      active: false,
    },
  });

  const elastique = await prisma.product.upsert({
    where: { slug: 'elastique-fitness' },
    update: {},
    create: {
      name: 'Élastique Fitness',
      slug: 'elastique-fitness',
      description: 'Élastique de résistance inclus dans le Kit Complet.',
      price: 0,
      costPrice: 0,
      images: [],
      active: false,
    },
  });

  const serviette = await prisma.product.upsert({
    where: { slug: 'serviette-sport' },
    update: {},
    create: {
      name: 'Serviette Sport',
      slug: 'serviette-sport',
      description: 'Petite serviette sport incluse dans le Kit Complet.',
      price: 0,
      costPrice: 0,
      images: [],
      active: false,
    },
  });

  // Seed bundles — delete existing bundle items first, then upsert bundles
  // Helper to upsert a bundle with its items
  async function upsertBundle(data: {
    slug: string;
    label: string;
    description: string;
    price: number;
    comparePrice: number | null;
    badge: string | null;
    position: number;
    items: { productId: string; quantity: number }[];
  }) {
    const bundle = await prisma.bundle.upsert({
      where: { slug: data.slug },
      update: {
        label: data.label,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        badge: data.badge,
        position: data.position,
      },
      create: {
        slug: data.slug,
        label: data.label,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        badge: data.badge,
        position: data.position,
        active: true,
      },
    });

    // Replace items
    await prisma.bundleItem.deleteMany({ where: { bundleId: bundle.id } });
    for (const item of data.items) {
      await prisma.bundleItem.create({
        data: {
          bundleId: bundle.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }
    return bundle;
  }

  await upsertBundle({
    slug: 'sport',
    label: 'Sport',
    description: 'ClipBag + Shaker Sport',
    price: 34.99,
    comparePrice: 69.99,
    badge: '-50%',
    position: 1,
    items: [
      { productId: clipbag.id, quantity: 1 },
      { productId: shaker.id, quantity: 1 },
    ],
  });

  await upsertBundle({
    slug: 'complet',
    label: 'Kit Complet',
    description: 'ClipBag + Shaker + Élastique + Serviette',
    price: 49.99,
    comparePrice: 99.99,
    badge: '-50%',
    position: 2,
    items: [
      { productId: clipbag.id, quantity: 1 },
      { productId: shaker.id, quantity: 1 },
      { productId: elastique.id, quantity: 1 },
      { productId: serviette.id, quantity: 1 },
    ],
  });

  await upsertBundle({
    slug: 'duo',
    label: 'Duo',
    description: '2x ClipBag',
    price: 49.99,
    comparePrice: 99.98,
    badge: '-50%',
    position: 3,
    items: [{ productId: clipbag.id, quantity: 2 }],
  });

  await upsertBundle({
    slug: 'equipe',
    label: 'Équipe',
    description: '5x ClipBag',
    price: 99.99,
    comparePrice: 249.95,
    badge: '-60%',
    position: 4,
    items: [{ productId: clipbag.id, quantity: 5 }],
  });

  // Seed admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@clipbag.shop';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  console.log(`Seed completed — admin: ${adminEmail}`);
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

- [ ] **Step 2: Run seed**

Run:
```bash
cd backend && npx prisma db seed
```

Expected: "Seed completed" message.

- [ ] **Step 3: Commit**

```bash
git add backend/prisma/seed.ts
git commit -m "feat(db): seed accessory products and bundles"
```

---

### Task 3: Backend — BundlesModule (public + admin CRUD)

**Files:**
- Create: `backend/src/bundles/bundles.module.ts`
- Create: `backend/src/bundles/bundles.service.ts`
- Create: `backend/src/bundles/bundles.controller.ts`
- Create: `backend/src/bundles/dto/create-bundle.dto.ts`
- Create: `backend/src/bundles/dto/update-bundle.dto.ts`
- Modify: `backend/src/app.module.ts`
- Modify: `backend/src/admin/admin.controller.ts`
- Modify: `backend/src/admin/admin.service.ts`
- Modify: `backend/src/admin/admin.module.ts`

- [ ] **Step 1: Create DTOs**

Create `backend/src/bundles/dto/create-bundle.dto.ts`:

```typescript
import { IsString, IsNumber, IsOptional, IsBoolean, IsInt, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BundleItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateBundleDto {
  @IsString()
  slug: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  comparePrice?: number | null;

  @IsOptional()
  @IsString()
  badge?: string | null;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BundleItemDto)
  items: BundleItemDto[];
}
```

Create `backend/src/bundles/dto/update-bundle.dto.ts`:

```typescript
import { IsString, IsNumber, IsOptional, IsBoolean, IsInt, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BundleItemDto } from './create-bundle.dto';

export class UpdateBundleDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  comparePrice?: number | null;

  @IsOptional()
  @IsString()
  badge?: string | null;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BundleItemDto)
  items?: BundleItemDto[];
}
```

- [ ] **Step 2: Create BundlesService**

Create `backend/src/bundles/bundles.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';

const BUNDLE_INCLUDE = {
  items: { include: { product: true } },
} as const;

@Injectable()
export class BundlesService {
  constructor(private prisma: PrismaService) {}

  async findActive() {
    return this.prisma.bundle.findMany({
      where: { active: true },
      orderBy: { position: 'asc' },
      include: BUNDLE_INCLUDE,
    });
  }

  async findAll() {
    return this.prisma.bundle.findMany({
      orderBy: { position: 'asc' },
      include: BUNDLE_INCLUDE,
    });
  }

  async findById(id: string) {
    const bundle = await this.prisma.bundle.findUnique({
      where: { id },
      include: BUNDLE_INCLUDE,
    });
    if (!bundle) throw new NotFoundException('Bundle not found');
    return bundle;
  }

  async create(dto: CreateBundleDto) {
    return this.prisma.bundle.create({
      data: {
        slug: dto.slug,
        label: dto.label,
        description: dto.description || '',
        price: dto.price,
        comparePrice: dto.comparePrice ?? null,
        badge: dto.badge ?? null,
        position: dto.position ?? 0,
        active: dto.active ?? true,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: BUNDLE_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateBundleDto) {
    await this.findById(id); // throws if not found

    const { items, ...data } = dto;

    const bundle = await this.prisma.bundle.update({
      where: { id },
      data,
      include: BUNDLE_INCLUDE,
    });

    if (items) {
      await this.prisma.bundleItem.deleteMany({ where: { bundleId: id } });
      await Promise.all(
        items.map((item) =>
          this.prisma.bundleItem.create({
            data: { bundleId: id, productId: item.productId, quantity: item.quantity },
          }),
        ),
      );
      return this.findById(id);
    }

    return bundle;
  }

  async remove(id: string) {
    await this.findById(id); // throws if not found
    return this.prisma.bundle.delete({ where: { id } });
  }
}
```

- [ ] **Step 3: Create BundlesController (public endpoint)**

Create `backend/src/bundles/bundles.controller.ts`:

```typescript
import { Controller, Get } from '@nestjs/common';
import { BundlesService } from './bundles.service';

@Controller('bundles')
export class BundlesController {
  constructor(private bundlesService: BundlesService) {}

  @Get()
  findActive() {
    return this.bundlesService.findActive();
  }
}
```

- [ ] **Step 4: Create BundlesModule**

Create `backend/src/bundles/bundles.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { BundlesController } from './bundles.controller';
import { BundlesService } from './bundles.service';

@Module({
  controllers: [BundlesController],
  providers: [BundlesService],
  exports: [BundlesService],
})
export class BundlesModule {}
```

- [ ] **Step 5: Register BundlesModule in AppModule**

In `backend/src/app.module.ts`, add import:

```typescript
import { BundlesModule } from './bundles/bundles.module';
```

Add `BundlesModule` to the `imports` array after `ProductsModule`.

- [ ] **Step 6: Add admin bundle routes to AdminController**

In `backend/src/admin/admin.controller.ts`, add imports:

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
```

Add `BundlesService` to the constructor and add these methods:

```typescript
import { BundlesService } from '../bundles/bundles.service';
import { CreateBundleDto } from '../bundles/dto/create-bundle.dto';
import { UpdateBundleDto } from '../bundles/dto/update-bundle.dto';

// In constructor:
constructor(
  private adminService: AdminService,
  private bundlesService: BundlesService,
) {}

// Add methods:
@Get('bundles')
getBundles() {
  return this.bundlesService.findAll();
}

@Post('bundles')
createBundle(@Body() dto: CreateBundleDto) {
  return this.bundlesService.create(dto);
}

@Put('bundles/:id')
updateBundle(@Param('id') id: string, @Body() dto: UpdateBundleDto) {
  return this.bundlesService.update(id, dto);
}

@Delete('bundles/:id')
deleteBundle(@Param('id') id: string) {
  return this.bundlesService.remove(id);
}
```

- [ ] **Step 7: Import BundlesModule in AdminModule**

In `backend/src/admin/admin.module.ts`:

```typescript
import { BundlesModule } from '../bundles/bundles.module';

@Module({
  imports: [AuthModule, BundlesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
```

- [ ] **Step 8: Verify build**

Run:
```bash
cd backend && npx nest build
```

Expected: Build succeeds with no errors.

- [ ] **Step 9: Commit**

```bash
git add backend/src/bundles/ backend/src/app.module.ts backend/src/admin/
git commit -m "feat(api): add BundlesModule with public and admin CRUD endpoints"
```

---

### Task 4: Backend — Modify checkout to use bundles from DB

**Files:**
- Modify: `backend/src/payments/payments.service.ts`
- Modify: `backend/src/payments/dto/create-checkout.dto.ts`
- Modify: `backend/src/payments/payments.module.ts`

- [ ] **Step 1: Update CreateCheckoutDto — replace packType with bundleId**

In `backend/src/payments/dto/create-checkout.dto.ts`, replace the `packType` field:

```typescript
// Remove these lines:
@IsOptional()
@IsString()
@IsIn(['solo', 'duo', 'equipe', ''])
packType?: string;

// Replace with:
@IsOptional()
@IsString()
bundleId?: string;
```

Also remove the `IsIn` import if it's no longer used.

- [ ] **Step 2: Import BundlesModule in PaymentsModule**

In `backend/src/payments/payments.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BundlesModule } from '../bundles/bundles.module';

@Module({
  imports: [BundlesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
```

- [ ] **Step 3: Rewrite PaymentsService.createCheckoutSession**

Replace the entire `createCheckoutSession` method and remove the `PACK_CONFIG` constant in `backend/src/payments/payments.service.ts`:

```typescript
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { BundlesService } from '../bundles/bundles.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

// DELETE the PACK_CONFIG constant entirely

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private emailService: EmailService,
    private bundlesService: BundlesService,
  ) {
    this.stripe = new Stripe(this.configService.getOrThrow('STRIPE_SECRET_KEY'));
  }

  async createCheckoutSession(dto: CreateCheckoutDto) {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id: dto.productId },
    });

    let totalCents: number;
    let stripeUnitAmount: number;
    let displayName: string;
    let orderItems: { productId: string; quantity: number; price: number; bundleSlug: string | null }[];

    if (dto.bundleId) {
      // Bundle checkout
      const bundle = await this.bundlesService.findById(dto.bundleId);
      if (!bundle.active) {
        throw new BadRequestException('This bundle is no longer available');
      }

      totalCents = Math.round(bundle.price * 100);
      stripeUnitAmount = totalCents;
      displayName = bundle.label;

      orderItems = bundle.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: bundle.price / bundle.items.reduce((sum, i) => sum + i.quantity, 0) * item.quantity,
        bundleSlug: bundle.slug,
      }));
    } else {
      // Solo checkout
      totalCents = Math.round(product.price * dto.quantity * 100);
      stripeUnitAmount = Math.round(product.price * 100);
      displayName = product.name;

      orderItems = [{
        productId: product.id,
        quantity: dto.quantity,
        price: product.price,
        bundleSlug: null,
      }];
    }

    const total = totalCents / 100;

    const order = await this.prisma.order.create({
      data: {
        customerEmail: dto.customerEmail,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone || '',
        shippingAddress: {
          line1: dto.shippingAddress.line1,
          line2: dto.shippingAddress.line2 || '',
          city: dto.shippingAddress.city,
          postalCode: dto.shippingAddress.postalCode,
          country: dto.shippingAddress.country || 'FR',
        },
        total,
        items: {
          create: orderItems,
        },
      },
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: dto.customerEmail,
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: displayName,
              description: product.description,
              images: (() => {
                const img = product.stripeImage || product.images[0];
                if (!img) return [];
                const url = img.startsWith('http') ? img : `${this.configService.get('FRONTEND_URL')}${img}`;
                return [url];
              })(),
            },
            unit_amount: stripeUnitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: order.id, sport: dto.sport || '' },
      success_url: `${this.configService.get('FRONTEND_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return { sessionId: session.id, url: session.url };
  }

  // ... rest of the methods (handleWebhook, cancelOrder, getSessionStatus) stay unchanged
```

- [ ] **Step 4: Verify build**

Run:
```bash
cd backend && npx nest build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add backend/src/payments/ backend/src/bundles/
git commit -m "feat(api): replace hardcoded PACK_CONFIG with DB-driven bundle checkout"
```

---

### Task 5: Backend — Update tests for new checkout flow

**Files:**
- Modify: `backend/src/payments/payments.service.spec.ts`
- Modify: `backend/src/payments/dto/create-checkout.dto.spec.ts`

- [ ] **Step 1: Update PaymentsService spec**

Replace the entire content of `backend/src/payments/payments.service.spec.ts` with:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { BundlesService } from '../bundles/bundles.service';

const mockStripe = {
  checkout: {
    sessions: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  },
  webhooks: {
    constructEvent: jest.fn(),
  },
};

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => mockStripe);
});

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: {
    product: { findUniqueOrThrow: jest.Mock };
    order: { create: jest.Mock; update: jest.Mock; findUnique: jest.Mock };
  };
  let bundlesService: { findById: jest.Mock };

  const customerFields = {
    customerName: 'Jean Dupont',
    customerEmail: 'jean@test.com',
    customerPhone: '+33612345678',
    shippingAddress: {
      line1: '12 rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
    },
  };

  const product = {
    id: 'prod-1',
    name: 'Test Product',
    description: 'A description',
    price: 29.99,
    images: ['https://example.com/img.jpg'],
  };

  beforeEach(async () => {
    prisma = {
      product: { findUniqueOrThrow: jest.fn() },
      order: { create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
    };
    bundlesService = { findById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: EmailService,
          useValue: {
            sendOrderConfirmation: jest.fn(),
            sendShippingNotification: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
            getOrThrow: jest.fn().mockReturnValue('sk_test_fake'),
          },
        },
        { provide: BundlesService, useValue: bundlesService },
      ],
    }).compile();

    service = module.get(PaymentsService);
    jest.clearAllMocks();
  });

  describe('createCheckoutSession', () => {
    it('should create solo checkout at unit price * quantity', async () => {
      prisma.product.findUniqueOrThrow.mockResolvedValue(product);
      prisma.order.create.mockResolvedValue({ id: 'order-1' });
      prisma.order.update.mockResolvedValue({});
      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_solo',
        url: 'https://checkout.stripe.com/solo',
      });

      const result = await service.createCheckoutSession({
        productId: 'prod-1',
        quantity: 2,
        ...customerFields,
      });

      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ total: 59.98 }),
        }),
      );
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: [
            expect.objectContaining({
              price_data: expect.objectContaining({
                unit_amount: 2999,
              }),
              quantity: 1,
            }),
          ],
        }),
      );
      expect(result.sessionId).toBe('cs_solo');
    });

    it('should create bundle checkout at bundle price', async () => {
      prisma.product.findUniqueOrThrow.mockResolvedValue(product);
      prisma.order.create.mockResolvedValue({ id: 'order-bundle' });
      prisma.order.update.mockResolvedValue({});
      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_bundle',
        url: 'https://checkout.stripe.com/bundle',
      });
      bundlesService.findById.mockResolvedValue({
        id: 'bundle-sport',
        slug: 'sport',
        label: 'Sport',
        price: 34.99,
        active: true,
        items: [
          { productId: 'prod-1', quantity: 1, product },
          { productId: 'prod-shaker', quantity: 1, product: { id: 'prod-shaker', name: 'Shaker' } },
        ],
      });

      const result = await service.createCheckoutSession({
        productId: 'prod-1',
        quantity: 1,
        bundleId: 'bundle-sport',
        ...customerFields,
      });

      expect(bundlesService.findById).toHaveBeenCalledWith('bundle-sport');
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            total: 34.99,
            items: expect.objectContaining({
              create: expect.arrayContaining([
                expect.objectContaining({ productId: 'prod-1', bundleSlug: 'sport' }),
                expect.objectContaining({ productId: 'prod-shaker', bundleSlug: 'sport' }),
              ]),
            }),
          }),
        }),
      );
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: [
            expect.objectContaining({
              price_data: expect.objectContaining({
                unit_amount: 3499,
                product_data: expect.objectContaining({ name: 'Sport' }),
              }),
              quantity: 1,
            }),
          ],
        }),
      );
      expect(result.sessionId).toBe('cs_bundle');
    });

    it('should reject inactive bundle', async () => {
      prisma.product.findUniqueOrThrow.mockResolvedValue(product);
      bundlesService.findById.mockResolvedValue({
        id: 'bundle-old',
        slug: 'old',
        label: 'Old',
        price: 10,
        active: false,
        items: [],
      });

      await expect(
        service.createCheckoutSession({
          productId: 'prod-1',
          quantity: 1,
          bundleId: 'bundle-old',
          ...customerFields,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when bundle not found', async () => {
      prisma.product.findUniqueOrThrow.mockResolvedValue(product);
      bundlesService.findById.mockRejectedValue(new NotFoundException('Bundle not found'));

      await expect(
        service.createCheckoutSession({
          productId: 'prod-1',
          quantity: 1,
          bundleId: 'nonexistent',
          ...customerFields,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('handleWebhook', () => {
    it('should update order status on checkout.session.completed', async () => {
      const session = { id: 'cs_test', payment_intent: 'pi_test' };
      mockStripe.webhooks.constructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: session },
      });
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        orderNumber: 1,
        customerName: 'Jean',
        customerEmail: 'jean@test.com',
        total: 29.99,
        items: [{ product: { name: 'ClipBag' }, quantity: 1, price: 29.99 }],
        shippingAddress: { line1: '12 rue', city: 'Paris', postalCode: '75001' },
      });

      const result = await service.handleWebhook(Buffer.from(''), 'sig');

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { stripeSessionId: 'cs_test' },
        data: { status: 'PAID', stripePaymentId: 'pi_test' },
        include: { items: { include: { product: true } } },
      });
      expect(result).toEqual({ received: true });
    });
  });

  describe('cancelOrder', () => {
    it('should cancel pending order', async () => {
      prisma.order.findUnique.mockResolvedValue({ id: 'order-1', status: 'PENDING' });
      prisma.order.update.mockResolvedValue({});

      const result = await service.cancelOrder('cs_test');

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { status: 'CANCELLED' },
      });
      expect(result).toEqual({ cancelled: true });
    });
  });
});
```

- [ ] **Step 2: Update DTO spec**

In `backend/src/payments/dto/create-checkout.dto.spec.ts`, replace all `packType` references. Remove the tests for `packType` validation (`'solo'`, `'duo'`, `'equipe'`, `invalid packType`, `without packType`). Add a test for `bundleId`:

```typescript
it('should pass with valid bundleId', async () => {
  const dto = toDto({ ...validBase, bundleId: '550e8400-e29b-41d4-a716-446655440000' });
  const errors = await validate(dto);
  expect(errors).toHaveLength(0);
});

it('should pass without bundleId (optional)', async () => {
  const dto = toDto({ ...validBase, quantity: 3 });
  const errors = await validate(dto);
  expect(errors).toHaveLength(0);
});
```

- [ ] **Step 3: Run tests**

Run:
```bash
cd backend && npx jest --passWithNoTests
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add backend/src/payments/
git commit -m "test(api): update payment tests for bundle-based checkout"
```

---

### Task 6: Backend — BundlesService tests

**Files:**
- Create: `backend/src/bundles/bundles.service.spec.ts`

- [ ] **Step 1: Write BundlesService tests**

Create `backend/src/bundles/bundles.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BundlesService } from './bundles.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BundlesService', () => {
  let service: BundlesService;
  let prisma: {
    bundle: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    bundleItem: { deleteMany: jest.Mock; create: jest.Mock };
  };

  const mockBundle = {
    id: 'bundle-1',
    slug: 'sport',
    label: 'Sport',
    price: 34.99,
    active: true,
    position: 1,
    items: [
      { id: 'bi-1', productId: 'prod-1', quantity: 1, product: { id: 'prod-1', name: 'ClipBag' } },
      { id: 'bi-2', productId: 'prod-2', quantity: 1, product: { id: 'prod-2', name: 'Shaker' } },
    ],
  };

  beforeEach(async () => {
    prisma = {
      bundle: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      bundleItem: { deleteMany: jest.fn(), create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BundlesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(BundlesService);
  });

  describe('findActive', () => {
    it('should return only active bundles ordered by position', async () => {
      prisma.bundle.findMany.mockResolvedValue([mockBundle]);

      const result = await service.findActive();

      expect(prisma.bundle.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: { position: 'asc' },
        include: { items: { include: { product: true } } },
      });
      expect(result).toEqual([mockBundle]);
    });
  });

  describe('findAll', () => {
    it('should return all bundles ordered by position', async () => {
      prisma.bundle.findMany.mockResolvedValue([mockBundle]);

      const result = await service.findAll();

      expect(prisma.bundle.findMany).toHaveBeenCalledWith({
        orderBy: { position: 'asc' },
        include: { items: { include: { product: true } } },
      });
      expect(result).toEqual([mockBundle]);
    });
  });

  describe('findById', () => {
    it('should return bundle by id', async () => {
      prisma.bundle.findUnique.mockResolvedValue(mockBundle);

      const result = await service.findById('bundle-1');

      expect(result).toEqual(mockBundle);
    });

    it('should throw NotFoundException when bundle not found', async () => {
      prisma.bundle.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a bundle with items', async () => {
      prisma.bundle.create.mockResolvedValue(mockBundle);

      const result = await service.create({
        slug: 'sport',
        label: 'Sport',
        price: 34.99,
        items: [
          { productId: 'prod-1', quantity: 1 },
          { productId: 'prod-2', quantity: 1 },
        ],
      });

      expect(prisma.bundle.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'sport',
            label: 'Sport',
            price: 34.99,
            items: {
              create: [
                { productId: 'prod-1', quantity: 1 },
                { productId: 'prod-2', quantity: 1 },
              ],
            },
          }),
        }),
      );
      expect(result).toEqual(mockBundle);
    });
  });

  describe('remove', () => {
    it('should delete an existing bundle', async () => {
      prisma.bundle.findUnique.mockResolvedValue(mockBundle);
      prisma.bundle.delete.mockResolvedValue(mockBundle);

      await service.remove('bundle-1');

      expect(prisma.bundle.delete).toHaveBeenCalledWith({ where: { id: 'bundle-1' } });
    });

    it('should throw NotFoundException for nonexistent bundle', async () => {
      prisma.bundle.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
```

- [ ] **Step 2: Run tests**

Run:
```bash
cd backend && npx jest bundles.service.spec --verbose
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add backend/src/bundles/bundles.service.spec.ts
git commit -m "test(api): add BundlesService unit tests"
```

---

### Task 7: Admin UI — Bundles management page

**Files:**
- Create: `frontend/pages/admin/bundles.vue`
- Modify: `frontend/layouts/admin.vue`

- [ ] **Step 1: Add "Packs" link to admin sidebar**

In `frontend/layouts/admin.vue`, add a new entry to `navLinks` array between "Commandes" and "Produit":

```typescript
const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/admin/orders', label: 'Commandes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { to: '/admin/bundles', label: 'Packs', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { to: '/admin/product', label: 'Produit', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
]
```

Note: update the Packs icon to a distinct one:
```
M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10
```

- [ ] **Step 2: Create the bundles admin page**

Create `frontend/pages/admin/bundles.vue`:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

interface BundleItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    costPrice: number
    supplierUrl: string | null
  }
}

interface Bundle {
  id: string
  slug: string
  label: string
  description: string
  price: number
  comparePrice: number | null
  badge: string | null
  position: number
  active: boolean
  items: BundleItem[]
}

interface Product {
  id: string
  name: string
  costPrice: number
}

const { apiFetch } = useApi()
const authStore = useAuthStore()

const bundles = ref<Bundle[]>([])
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const success = ref('')
const saving = ref(false)

// Edit state
const editing = ref<Bundle | null>(null)
const form = reactive({
  slug: '',
  label: '',
  description: '',
  price: 0,
  comparePrice: 0 as number | null,
  badge: '' as string | null,
  position: 0,
  active: true,
  items: [] as { productId: string; quantity: number }[],
})

const isNew = computed(() => !editing.value)

const showSuccess = (msg: string) => {
  success.value = msg
  setTimeout(() => { success.value = '' }, 3000)
}

const headers = () => ({ Authorization: `Bearer ${authStore.token}` })

const fetchData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [b, p] = await Promise.all([
      apiFetch<Bundle[]>('/admin/bundles', { headers: headers() }),
      apiFetch<Product[]>('/products'),
    ])
    bundles.value = b
    products.value = p
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors du chargement'
    if (e?.status === 401) authStore.logout()
  } finally {
    loading.value = false
  }
}

const slugify = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const openNew = () => {
  editing.value = null
  form.slug = ''
  form.label = ''
  form.description = ''
  form.price = 0
  form.comparePrice = null
  form.badge = null
  form.position = bundles.value.length + 1
  form.active = true
  form.items = [{ productId: '', quantity: 1 }]
}

const openEdit = (bundle: Bundle) => {
  editing.value = bundle
  form.slug = bundle.slug
  form.label = bundle.label
  form.description = bundle.description
  form.price = bundle.price
  form.comparePrice = bundle.comparePrice
  form.badge = bundle.badge
  form.position = bundle.position
  form.active = bundle.active
  form.items = bundle.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
}

const closeEdit = () => {
  editing.value = null
  form.label = ''
}

const addItem = () => form.items.push({ productId: '', quantity: 1 })
const removeItem = (idx: number) => form.items.splice(idx, 1)

const totalCost = computed(() =>
  form.items.reduce((sum, item) => {
    const prod = products.value.find((p) => p.id === item.productId)
    return sum + (prod?.costPrice || 0) * item.quantity
  }, 0),
)

const margin = computed(() => form.price - totalCost.value)

const saveBundle = async () => {
  saving.value = true
  error.value = ''
  try {
    const body = {
      slug: form.slug || slugify(form.label),
      label: form.label,
      description: form.description,
      price: form.price,
      comparePrice: form.comparePrice || null,
      badge: form.badge || null,
      position: form.position,
      active: form.active,
      items: form.items.filter((i) => i.productId),
    }
    if (editing.value) {
      await apiFetch(`/admin/bundles/${editing.value.id}`, { method: 'PUT', headers: headers(), body })
      showSuccess('Pack mis a jour')
    } else {
      await apiFetch('/admin/bundles', { method: 'POST', headers: headers(), body })
      showSuccess('Pack cree')
    }
    closeEdit()
    await fetchData()
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}

const toggleActive = async (bundle: Bundle) => {
  try {
    await apiFetch(`/admin/bundles/${bundle.id}`, {
      method: 'PUT',
      headers: headers(),
      body: { active: !bundle.active },
    })
    bundle.active = !bundle.active
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur'
  }
}

const deleteBundle = async (bundle: Bundle) => {
  if (!confirm(`Supprimer le pack "${bundle.label}" ?`)) return
  try {
    await apiFetch(`/admin/bundles/${bundle.id}`, { method: 'DELETE', headers: headers() })
    bundles.value = bundles.value.filter((b) => b.id !== bundle.id)
    showSuccess('Pack supprime')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la suppression'
  }
}

// Fetch all products including inactive for the dropdown
const allProducts = ref<Product[]>([])
const fetchAllProducts = async () => {
  try {
    // Use admin endpoint to get all products or public (which only returns active)
    // For now, use public + we need inactive ones too — we'll add a simple admin products endpoint
    // Workaround: fetch bundles data which includes product info
    const prods = await apiFetch<Product[]>('/products', { headers: headers() })
    allProducts.value = prods
  } catch {
    // fallback
  }
}

onMounted(async () => {
  await fetchData()
  await fetchAllProducts()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white tracking-tight">Packs</h1>
      <button
        v-if="!form.label || editing === null && !form.label"
        class="px-5 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        @click="openNew"
      >
        + Creer un pack
      </button>
    </div>

    <!-- Toasts -->
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="-translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-2 opacity-0">
      <div v-if="error" class="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{{ error }}</div>
    </Transition>
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="-translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-2 opacity-0">
      <div v-if="success" class="mb-5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">{{ success }}</div>
    </Transition>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-400">Chargement...</div>

    <!-- Edit form (inline) -->
    <div v-if="form.label || isNew && form.items.length > 0" class="mb-8 bg-white/[0.03] rounded-2xl p-6 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-white">{{ editing ? `Modifier "${editing.label}"` : 'Nouveau pack' }}</h2>
        <button class="text-gray-400 hover:text-white text-sm cursor-pointer" @click="closeEdit">Annuler</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Nom</label>
          <input v-model="form.label" type="text" placeholder="Kit Sport" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50" @input="if (isNew) form.slug = slugify(form.label)" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Slug</label>
          <input v-model="form.slug" type="text" placeholder="sport" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Prix</label>
          <input v-model.number="form.price" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 tabular-nums" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Prix barre</label>
          <input v-model.number="form.comparePrice" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 tabular-nums" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Badge</label>
          <input v-model="form.badge" type="text" placeholder="-50%" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Position</label>
          <input v-model.number="form.position" type="number" min="0" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 tabular-nums" />
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
        <input v-model="form.description" type="text" placeholder="ClipBag + Shaker Sport" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50" />
      </div>

      <!-- Items -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Contenu du pack</label>
          <button type="button" class="text-xs text-brand hover:text-brand-light cursor-pointer" @click="addItem">+ Ajouter</button>
        </div>
        <div class="space-y-2">
          <div v-for="(item, idx) in form.items" :key="idx" class="flex gap-3 items-center">
            <select v-model="form.items[idx].productId" class="flex-1 px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50">
              <option value="" disabled class="bg-gray-900">Choisir un produit</option>
              <option v-for="p in products" :key="p.id" :value="p.id" class="bg-gray-900">{{ p.name }}</option>
              <!-- Also show products from bundle items that might be inactive -->
              <template v-if="editing">
                <option v-for="bi in editing.items.filter(bi => !products.find(p => p.id === bi.productId))" :key="bi.productId" :value="bi.productId" class="bg-gray-900">{{ bi.product.name }}</option>
              </template>
            </select>
            <input v-model.number="form.items[idx].quantity" type="number" min="1" class="w-20 px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-brand/50 tabular-nums" />
            <button v-if="form.items.length > 1" type="button" class="text-red-400/60 hover:text-red-400 cursor-pointer p-1" @click="removeItem(idx)">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <!-- Cost / Margin -->
        <div v-if="form.price > 0" class="flex items-center gap-4 mt-3 px-3 py-2 bg-white/[0.02] rounded-lg text-xs">
          <span class="text-gray-500">Cout achat: <span class="text-white">{{ totalCost.toFixed(2) }}EUR</span></span>
          <span class="text-gray-500">Marge: <span :class="margin > 0 ? 'text-emerald-400' : 'text-red-400'">{{ margin.toFixed(2) }}EUR</span></span>
        </div>
      </div>

      <!-- Active toggle + Save -->
      <div class="flex items-center justify-between pt-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="form.active" type="checkbox" class="w-4 h-4 rounded border-white/20 bg-white/5 text-brand focus:ring-brand/50 cursor-pointer" />
          <span class="text-sm text-gray-400">Actif</span>
        </label>
        <button :disabled="saving || !form.label" class="px-5 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" @click="saveBundle">
          {{ saving ? 'Enregistrement...' : editing ? 'Mettre a jour' : 'Creer' }}
        </button>
      </div>
    </div>

    <!-- Bundle cards -->
    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="bundle in bundles" :key="bundle.id" :class="['bg-white/[0.03] rounded-2xl p-5 border transition-colors', bundle.active ? 'border-white/[0.06]' : 'border-red-500/20 opacity-60']">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-white font-semibold">{{ bundle.label }}</h3>
              <span v-if="bundle.badge" class="text-urgency text-[10px] font-bold uppercase">{{ bundle.badge }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">{{ bundle.slug }} · position {{ bundle.position }}</p>
          </div>
          <div class="text-right">
            <div class="text-white font-semibold tabular-nums">{{ bundle.price.toFixed(2) }}EUR</div>
            <div v-if="bundle.comparePrice" class="text-xs text-gray-500 line-through tabular-nums">{{ bundle.comparePrice.toFixed(2) }}EUR</div>
          </div>
        </div>

        <div class="mb-4 space-y-1">
          <div v-for="item in bundle.items" :key="item.id" class="flex items-center gap-2 text-xs text-gray-400">
            <span class="text-white/60">{{ item.quantity }}x</span>
            <span>{{ item.product.name }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
          <button class="text-xs text-brand hover:text-brand-light cursor-pointer" @click="openEdit(bundle)">Modifier</button>
          <button class="text-xs cursor-pointer" :class="bundle.active ? 'text-orange-400 hover:text-orange-300' : 'text-emerald-400 hover:text-emerald-300'" @click="toggleActive(bundle)">
            {{ bundle.active ? 'Desactiver' : 'Activer' }}
          </button>
          <button class="text-xs text-red-400/60 hover:text-red-400 cursor-pointer ml-auto" @click="deleteBundle(bundle)">Supprimer</button>
        </div>
      </div>
    </div>

    <div v-if="!loading && bundles.length === 0" class="text-center py-12 text-gray-500">
      <p class="text-sm">Aucun pack configure</p>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Verify the page loads**

Run the frontend dev server and navigate to `/admin/bundles`. You should see the bundle cards with data from the seed.

```bash
cd frontend && npx nuxt dev
```

- [ ] **Step 4: Commit**

```bash
git add frontend/pages/admin/bundles.vue frontend/layouts/admin.vue
git commit -m "feat(admin): add bundles management page with CRUD"
```

---

### Task 8: Admin UI — Show bundle detail in order modal

**Files:**
- Modify: `frontend/pages/admin/orders.vue`

- [ ] **Step 1: Update OrderItem interface to include bundleSlug**

In `frontend/pages/admin/orders.vue`, update the `OrderItem` interface:

```typescript
interface OrderItem {
  id: string
  quantity: number
  price: number
  variant: string | null
  bundleSlug: string | null
  product: {
    name: string
    slug: string
    images: string[]
    supplierUrl: string | null
  }
}
```

- [ ] **Step 2: Add bundle display helper**

After the existing `getSupplierProductUrl` function, add:

```typescript
const getBundleLabel = (order: Order) => {
  const slug = order.items?.[0]?.bundleSlug
  if (!slug) return null
  const labels: Record<string, string> = { sport: 'Pack Sport', complet: 'Pack Kit Complet', duo: 'Pack Duo', equipe: 'Pack Équipe' }
  return labels[slug] || `Pack ${slug}`
}
```

- [ ] **Step 3: Update the order detail modal items section**

In the template, find where order items are displayed in the detail modal. Add a bundle header before the items list, and add a supplier link per item. Look for the items section in the modal and update it to:

- Show "Pack Sport" or similar header when `bundleSlug` is present
- Show each item with its own "Commander chez fournisseur" link using `item.product.supplierUrl`

The exact location depends on the modal template — find the section that shows `selectedOrder.items` and wrap it with:

```vue
<!-- Bundle header -->
<div v-if="getBundleLabel(selectedOrder)" class="mb-2 px-3 py-1.5 bg-brand/10 rounded-lg">
  <span class="text-xs font-semibold text-brand">{{ getBundleLabel(selectedOrder) }}</span>
  <span class="text-xs text-gray-400 ml-2">{{ selectedOrder.total.toFixed(2) }}EUR</span>
</div>

<!-- Items -->
<div v-for="item in selectedOrder.items" :key="item.id" class="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
  <div>
    <span class="text-sm text-white">{{ item.quantity }}x {{ item.product.name }}</span>
    <span v-if="item.variant" class="text-xs text-gray-500 ml-2">{{ item.variant }}</span>
  </div>
  <a v-if="item.product.supplierUrl" :href="item.product.supplierUrl" target="_blank" rel="noopener" class="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1">
    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
    Fournisseur
  </a>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add frontend/pages/admin/orders.vue
git commit -m "feat(admin): show bundle detail and supplier links in order modal"
```

---

### Task 9: Frontend — Dynamic bundle loading and HeroSection integration

**Files:**
- Modify: `frontend/stores/product.ts`
- Modify: `frontend/pages/index.vue`
- Modify: `frontend/components/HeroSection.vue`

- [ ] **Step 1: Add bundles to product store**

In `frontend/stores/product.ts`, add bundle types and fetch action:

```typescript
import { defineStore } from 'pinia'

interface ProductVariants {
  colors: { name: string; value: string }[]
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  images: string[]
  stripeImage: string | null
  orderImage: string | null
  variants: ProductVariants | null
  active: boolean
}

interface BundleItem {
  id: string
  productId: string
  quantity: number
  product: { id: string; name: string }
}

interface Bundle {
  id: string
  slug: string
  label: string
  description: string
  price: number
  comparePrice: number | null
  badge: string | null
  position: number
  active: boolean
  items: BundleItem[]
}

export const useProductStore = defineStore('product', {
  state: () => ({
    product: null as Product | null,
    bundles: [] as Bundle[],
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
    async fetchBundles() {
      const { apiFetch } = useApi()
      this.bundles = await apiFetch<Bundle[]>('/bundles')
    },
  },
})
```

- [ ] **Step 2: Load bundles alongside product in index.vue**

In `frontend/pages/index.vue`, update the `useAsyncData` call to fetch both:

```typescript
await useAsyncData('product-and-bundles', async () => {
  await Promise.all([
    productStore.fetchProduct(),
    productStore.fetchBundles(),
  ])
})
```

- [ ] **Step 3: Replace hardcoded packs in HeroSection**

In `frontend/components/HeroSection.vue`, replace the hardcoded `packs` array and related logic.

Remove:
```typescript
const UNIT_PRICE = 29.99
const ORIGINAL_UNIT_PRICE = 49.99

interface Pack { name: string; label: string; qty: number; packPrice: number; badge: string; priceDisplay: string; oldPriceDisplay: string }

const packs: Pack[] = [
  { name: 'duo', label: 'Duo', qty: 2, packPrice: 49.99, badge: '-50%', priceDisplay: '49,99\u20AC', oldPriceDisplay: '99,98\u20AC' },
  { name: 'equipe', label: 'Équipe', qty: 5, packPrice: 99.99, badge: '-60%', priceDisplay: '99,99\u20AC', oldPriceDisplay: '249,95\u20AC' },
]

const currentPack = computed(() => packs.find(p => p.name === selectedPack.value))

const selectPack = (name: string) => {
  selectedPack.value = name
  const pack = packs.find(p => p.name === name)
  if (pack) {
    quantity.value = pack.qty
    fbTrack('AddToCart', { content_name: productStore.product?.name || 'ClipBag', content_ids: [productStore.product?.id || ''], content_type: 'product', value: pack.packPrice, currency: 'EUR' })
  }
}

const decrementQuantity = () => { if (quantity.value > 1) { quantity.value--; syncPackFromQuantity() } }
const incrementQuantity = () => { if (quantity.value < 10) { quantity.value++; syncPackFromQuantity() } }
const syncPackFromQuantity = () => { const match = packs.find(p => p.qty === quantity.value); selectedPack.value = match ? match.name : '' }
```

Replace with:
```typescript
const bundles = computed(() => productStore.bundles)
const selectedBundleId = ref('')

const currentBundle = computed(() => bundles.value.find(b => b.id === selectedBundleId.value))

const selectBundle = (id: string) => {
  if (selectedBundleId.value === id) {
    // Deselect → back to solo
    selectedBundleId.value = ''
    quantity.value = 1
    return
  }
  selectedBundleId.value = id
  quantity.value = 1
  const bundle = bundles.value.find(b => b.id === id)
  if (bundle) {
    fbTrack('AddToCart', { content_name: bundle.label, content_ids: [bundle.id], content_type: 'product', value: bundle.price, currency: 'EUR' })
  }
}

const decrementQuantity = () => { if (!currentBundle.value && quantity.value > 1) quantity.value-- }
const incrementQuantity = () => { if (!currentBundle.value && quantity.value < 10) quantity.value++ }

const unitPrice = computed(() => productStore.product?.price || 29.99)
const originalUnitPrice = computed(() => productStore.product?.comparePrice || 49.99)
```

Update price computeds:
```typescript
const formattedTotal = computed(() => {
  const total = currentBundle.value ? currentBundle.value.price : unitPrice.value * quantity.value
  return `${total.toFixed(2).replace('.', ',')}\u20AC`
})

const originalTotal = computed(() => {
  if (currentBundle.value?.comparePrice) return `${currentBundle.value.comparePrice.toFixed(2).replace('.', ',')}\u20AC`
  return `${(originalUnitPrice.value * quantity.value).toFixed(2).replace('.', ',')}\u20AC`
})

const savedAmount = computed(() => {
  const original = currentBundle.value?.comparePrice || originalUnitPrice.value * quantity.value
  const actual = currentBundle.value ? currentBundle.value.price : unitPrice.value * quantity.value
  return `${(original - actual).toFixed(2).replace('.', ',')}\u20AC`
})
```

Update the checkout call in `handleCheckout`:
```typescript
// Replace this line:
productId: productStore.product?.id || '', quantity: quantity.value, packType: selectedPack.value || undefined,

// With:
productId: productStore.product?.id || '', quantity: quantity.value, bundleId: selectedBundleId.value || undefined,
```

Update the pixel tracking in `handleCheckout`:
```typescript
const totalValue = currentBundle.value ? currentBundle.value.price : unitPrice.value * quantity.value
const pixelParams = { content_name: currentBundle.value?.label || productStore.product?.name || 'ClipBag', content_ids: [currentBundle.value?.id || productStore.product?.id || ''], content_type: 'product', num_items: quantity.value, value: totalValue, currency: 'EUR' }
```

- [ ] **Step 4: Update pack selection template in HeroSection**

In the template, find the pack selection section (around the `v-for="pack in packs"` loop). Replace it to use bundles:

```vue
<div
  v-for="bundle in bundles"
  :key="bundle.id"
  :class="[
    'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-[0.625rem] border cursor-pointer transition-all',
    selectedBundleId === bundle.id
      ? 'border-accent-dark bg-accent-dark/5'
      : 'border-border hover:border-accent-dark/40'
  ]"
  @click="selectBundle(bundle.id)"
>
  <span :class="['w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0', selectedBundleId === bundle.id ? 'border-accent-dark' : 'border-border']">
    <span v-if="selectedBundleId === bundle.id" class="w-1.5 h-1.5 rounded-full bg-accent-dark" />
  </span>
  <span class="text-text font-display font-semibold text-sm sm:text-base whitespace-nowrap">{{ bundle.label }}</span>
  <span class="text-text-muted text-xs sm:text-sm whitespace-nowrap">{{ bundle.description }}</span>
  <span v-if="bundle.badge" class="text-urgency text-[10px] sm:text-xs font-display font-bold uppercase whitespace-nowrap">{{ bundle.badge }}</span>
  <span class="ml-auto flex items-center gap-1.5">
    <span v-if="bundle.comparePrice" class="text-text-muted line-through text-xs sm:text-sm whitespace-nowrap">{{ bundle.comparePrice.toFixed(2).replace('.', ',') }}\u20AC</span>
    <span class="text-text font-display font-medium text-base sm:text-lg tracking-tight whitespace-nowrap">{{ bundle.price.toFixed(2).replace('.', ',') }}\u20AC</span>
  </span>
</div>
```

Also disable the quantity +/- buttons when a bundle is selected:

Find the quantity buttons and add `:disabled="!!currentBundle"` and a disabled style class.

- [ ] **Step 5: Verify frontend builds**

```bash
cd frontend && npx nuxt build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add frontend/stores/product.ts frontend/pages/index.vue frontend/components/HeroSection.vue
git commit -m "feat(frontend): replace hardcoded packs with dynamic bundles from API"
```

---

### Task 10: Admin — Expose all products (including inactive) for bundle editor

**Files:**
- Modify: `backend/src/admin/admin.controller.ts`
- Modify: `backend/src/admin/admin.service.ts`

- [ ] **Step 1: Add getProducts endpoint to AdminService**

In `backend/src/admin/admin.service.ts`, add:

```typescript
async getProducts() {
  return this.prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, slug: true, costPrice: true, supplierUrl: true, active: true },
  });
}
```

- [ ] **Step 2: Add route in AdminController**

In `backend/src/admin/admin.controller.ts`, add:

```typescript
@Get('products')
getProducts() {
  return this.adminService.getProducts();
}
```

- [ ] **Step 3: Update bundles.vue to use admin products endpoint**

In `frontend/pages/admin/bundles.vue`, replace the `fetchAllProducts` function and update the `fetchData` to use the admin endpoint:

```typescript
const fetchData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [b, p] = await Promise.all([
      apiFetch<Bundle[]>('/admin/bundles', { headers: headers() }),
      apiFetch<Product[]>('/admin/products', { headers: headers() }),
    ])
    bundles.value = b
    products.value = p
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors du chargement'
    if (e?.status === 401) authStore.logout()
  } finally {
    loading.value = false
  }
}
```

Remove the separate `fetchAllProducts` function and its `onMounted` call. Keep only:

```typescript
onMounted(fetchData)
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/admin/ frontend/pages/admin/bundles.vue
git commit -m "feat(admin): expose all products endpoint for bundle editor dropdown"
```

---

### Task 11: Final verification — end-to-end test

- [ ] **Step 1: Run all backend tests**

```bash
cd backend && npx jest --passWithNoTests --verbose
```

Expected: All tests pass.

- [ ] **Step 2: Run all frontend tests**

```bash
cd frontend && npx vitest run
```

Expected: All tests pass (some may need minor updates if they reference `packType`).

- [ ] **Step 3: Manual smoke test**

1. Start backend: `cd backend && npm run start:dev`
2. Start frontend: `cd frontend && npx nuxt dev`
3. Visit `/admin/bundles` — verify 4 bundles show (Sport, Kit Complet, Duo, Equipe)
4. Edit a bundle price, save, verify it persists
5. Toggle a bundle inactive, verify it disappears from client
6. Visit `/` — verify bundle selection works, prices display correctly
7. Select "Sport" bundle, verify quantity is locked, total shows 34.99EUR
8. Deselect → solo mode, verify +/- quantity works
9. Complete a test checkout with a bundle, verify order detail in admin shows bundle items with supplier links

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete bundles premium implementation"
```

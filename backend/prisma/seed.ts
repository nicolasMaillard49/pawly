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
      name: 'ClipBag',
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
      name: 'ClipBag',
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
    update: { name: 'Shaker', images: ['/images/product/shaker.png'] },
    create: {
      name: 'Shaker',
      slug: 'shaker-sport',
      description: 'Shaker sport inclus dans les packs premium.',
      price: 0,
      costPrice: 0,
      images: ['/images/product/shaker.png'],
      active: false,
    },
  });

  const elastique = await prisma.product.upsert({
    where: { slug: 'elastique-fitness' },
    update: { name: 'Élastique', images: ['/images/product/elastic.png'] },
    create: {
      name: 'Élastique',
      slug: 'elastique-fitness',
      description: 'Élastique de résistance inclus dans le Kit Complet.',
      price: 0,
      costPrice: 0,
      images: ['/images/product/elastic.png'],
      active: false,
    },
  });

  const serviette = await prisma.product.upsert({
    where: { slug: 'serviette-sport' },
    update: { name: 'Serviette', images: ['/images/product/servitte.png'] },
    create: {
      name: 'Serviette',
      slug: 'serviette-sport',
      description: 'Petite serviette sport incluse dans le Kit Complet.',
      price: 0,
      costPrice: 0,
      images: ['/images/product/servitte.png'],
      active: false,
    },
  });

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
    price: 39.99,
    comparePrice: 69.99,
    badge: '-43%',
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

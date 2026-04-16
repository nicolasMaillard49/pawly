import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5433/dropshipping_dev';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed main product
  const product = await prisma.product.upsert({
    where: { slug: 'default-product' },
    update: {
      name: 'Mon Produit',
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
      name: 'Mon Produit',
      slug: 'default-product',
      description:
        'Description du produit principal. Modifiez ce texte pour decrire votre produit.',
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

  // Bundles & accessories disabled — single-product store (Pawly).
  // Deactivate any legacy bundles/accessories so they don't surface in the API.
  await prisma.bundle.updateMany({ data: { active: false } });
  await prisma.product.updateMany({
    where: { slug: { in: ['shaker-sport', 'elastique-fitness', 'serviette-sport'] } },
    data: { active: false },
  });

  // Seed admin
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: {
      username: adminUsername,
      passwordHash,
    },
  });

  console.log(`Seed completed — admin: ${adminUsername}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

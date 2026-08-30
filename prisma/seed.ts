import { PrismaClient, Pricing } from '@prisma/client';
import { SEEDED_CATEGORIES, SEEDED_WEBSITES } from '../src/lib/initial-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma database seeding for WebNexus...');

  // 1. Seed Categories
  for (const cat of SEEDED_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
      },
      create: {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
      },
    });
  }
  console.log(`✅ Seeded ${SEEDED_CATEGORIES.length} categories.`);

  // 2. Seed Websites & Tags
  for (const site of SEEDED_WEBSITES) {
    const category = await prisma.category.findUnique({
      where: { slug: site.categoryId.replace('cat-', '') },
    });

    if (!category) continue;

    // Handle tags
    const tagConnectOrCreate = (site.tags as string[]).map((tagStr) => {
      const slug = tagStr.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        where: { slug },
        create: { name: tagStr, slug },
      };
    });

    await prisma.website.upsert({
      where: { slug: site.slug },
      update: {
        name: site.name,
        url: site.url,
        domain: site.domain,
        description: site.description,
        longDescription: site.longDescription,
        categoryId: category.id,
        pricing: site.pricing as Pricing,
        rating: site.rating,
        upvotes: site.upvotes,
        featured: site.featured,
        iconBg: site.iconBg,
        iconText: site.iconText,
        bannerGradient: site.bannerGradient,
        keyFeatures: site.keyFeatures,
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
      create: {
        id: site.id,
        slug: site.slug,
        name: site.name,
        url: site.url,
        domain: site.domain,
        description: site.description,
        longDescription: site.longDescription,
        categoryId: category.id,
        pricing: site.pricing as Pricing,
        rating: site.rating,
        upvotes: site.upvotes,
        featured: site.featured,
        iconBg: site.iconBg,
        iconText: site.iconText,
        bannerGradient: site.bannerGradient,
        keyFeatures: site.keyFeatures,
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
    });
  }

  console.log(`✅ Seeded ${SEEDED_WEBSITES.length} curated websites with tags into PostgreSQL.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

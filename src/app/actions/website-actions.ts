'use server'

import { prisma } from '@/lib/prisma';
import { SEEDED_CATEGORIES, SEEDED_WEBSITES } from '@/lib/initial-data';
import { Category, PricingType, SubmitWebsiteInput, Website } from '@/types';
import { Pricing } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// In-memory fallback cache for submissions if database connection is pending configuration
let localCustomWebsites: Website[] = [];

/**
 * Fetch all categories with dynamic website counts
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const dbCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: { websites: true },
        },
      },
    });

    if (dbCategories && dbCategories.length > 0) {
      return dbCategories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        icon: c.icon,
        color: c.color,
        _count: {
          websites: c._count.websites,
        },
      }));
    }
  } catch (error) {
    console.warn('Prisma database connection fallback for categories:', (error as Error).message);
  }

  // Fallback to seeded categories with calculated counts
  const allWebsites = [...SEEDED_WEBSITES, ...localCustomWebsites];
  return SEEDED_CATEGORIES.map((cat) => {
    const count = allWebsites.filter((s) => s.categoryId === cat.id || s.category?.slug === cat.slug).length;
    return {
      ...cat,
      _count: {
        websites: count,
      },
    };
  });
}

/**
 * Fetch filtered websites from PostgreSQL via Prisma
 */
export async function getWebsites(params?: {
  category?: string;
  search?: string;
  pricing?: string;
  tag?: string;
  sortBy?: string;
  bookmarkedIds?: string[];
  bookmarksOnly?: boolean;
}): Promise<Website[]> {
  const { category, search, pricing, tag, sortBy = 'popular', bookmarkedIds = [], bookmarksOnly = false } = params || {};

  try {
    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    if (pricing && pricing !== 'all') {
      where.pricing = pricing.toUpperCase() as Pricing;
    }

    if (tag) {
      where.tags = {
        some: {
          name: {
            equals: tag,
            mode: 'insensitive',
          },
        },
      };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { domain: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (bookmarksOnly) {
      where.id = { in: bookmarkedIds };
    }

    let orderBy: Record<string, string> = { upvotes: 'desc' };
    if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sortBy === 'name') {
      orderBy = { name: 'asc' };
    }

    const dbWebsites = await prisma.website.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy,
    });

    if (dbWebsites && dbWebsites.length > 0) {
      return dbWebsites.map((site) => ({
        id: site.id,
        slug: site.slug,
        name: site.name,
        url: site.url,
        domain: site.domain,
        description: site.description,
        longDescription: site.longDescription,
        categoryId: site.categoryId,
        category: site.category ? {
          id: site.category.id,
          slug: site.category.slug,
          name: site.category.name,
          icon: site.category.icon,
          color: site.category.color
        } : undefined,
        pricing: site.pricing as PricingType,
        rating: site.rating,
        upvotes: site.upvotes,
        featured: site.featured,
        iconBg: site.iconBg,
        iconText: site.iconText,
        bannerGradient: site.bannerGradient,
        keyFeatures: site.keyFeatures,
        tags: site.tags.map((t) => t.name),
        createdAt: site.createdAt.toISOString(),
      }));
    }
  } catch (error) {
    console.warn('Prisma database connection fallback for websites:', (error as Error).message);
  }

  // Graceful in-memory filtering fallback
  let list = [...SEEDED_WEBSITES, ...localCustomWebsites];

  if (category && category !== 'all') {
    list = list.filter((s) => s.categoryId === `cat-${category}` || s.categoryId === category);
  }

  if (pricing && pricing !== 'all') {
    list = list.filter((s) => s.pricing.toLowerCase() === pricing.toLowerCase());
  }

  if (tag) {
    list = list.filter((s) =>
      s.tags.some((t) => (typeof t === 'string' ? t : t.name).toLowerCase() === tag.toLowerCase())
    );
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        s.tags.some((t) => (typeof t === 'string' ? t : t.name).toLowerCase().includes(q))
    );
  }

  if (bookmarksOnly) {
    list = list.filter((s) => bookmarkedIds.includes(s.id));
  }

  list.sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return (b.upvotes || 0) - (a.upvotes || 0);
  });

  return list;
}

/**
 * Submit a new website into PostgreSQL
 */
export async function submitWebsite(input: SubmitWebsiteInput): Promise<{ success: boolean; website?: Website; error?: string }> {
  try {
    const cleanUrl = input.url.trim().startsWith('http') ? input.url.trim() : `https://${input.url.trim()}`;
    const domain = cleanUrl.replace(/^https?:\/\//i, '').split('/')[0];
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const tagObjects = input.tags.map((t) => {
      const s = t.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        where: { slug: s },
        create: { name: t, slug: s },
      };
    });

    try {
      const created = await prisma.website.create({
        data: {
          slug,
          name: input.name.trim(),
          url: cleanUrl,
          domain,
          description: input.description.trim(),
          longDescription: input.longDescription?.trim() || input.description.trim(),
          categoryId: input.categoryId,
          pricing: input.pricing as Pricing,
          rating: 5.0,
          upvotes: 1,
          featured: false,
          iconBg: '#6366f1',
          iconText: input.name.trim().slice(0, 2).toUpperCase(),
          bannerGradient: 'linear-gradient(135deg, #6366f1 0%, #1e1b4b 100%)',
          keyFeatures: input.keyFeatures.length > 0 ? input.keyFeatures : ['User Submitted Resource'],
          tags: {
            connectOrCreate: tagObjects,
          },
        },
        include: {
          category: true,
          tags: true,
        },
      });

      revalidatePath('/');
      return {
        success: true,
        website: {
          id: created.id,
          slug: created.slug,
          name: created.name,
          url: created.url,
          domain: created.domain,
          description: created.description,
          longDescription: created.longDescription,
          categoryId: created.categoryId,
          pricing: created.pricing as PricingType,
          rating: created.rating,
          upvotes: created.upvotes,
          featured: created.featured,
          iconBg: created.iconBg,
          iconText: created.iconText,
          bannerGradient: created.bannerGradient,
          keyFeatures: created.keyFeatures,
          tags: created.tags.map((t) => t.name),
          createdAt: created.createdAt.toISOString(),
        },
      };
    } catch (dbError) {
      console.warn('Prisma create fallback, saving to memory:', dbError);
    }

    // Fallback store in memory
    const newSite: Website = {
      id: 'custom-' + Date.now(),
      slug,
      name: input.name.trim(),
      url: cleanUrl,
      domain,
      description: input.description.trim(),
      longDescription: input.longDescription?.trim() || input.description.trim(),
      categoryId: input.categoryId,
      pricing: input.pricing,
      rating: 5.0,
      upvotes: 1,
      featured: false,
      iconBg: '#6366f1',
      iconText: input.name.trim().slice(0, 2).toUpperCase(),
      bannerGradient: 'linear-gradient(135deg, #6366f1 0%, #1e1b4b 100%)',
      keyFeatures: input.keyFeatures.length > 0 ? input.keyFeatures : ['User Submitted Resource'],
      tags: input.tags,
      createdAt: new Date().toISOString(),
    };

    localCustomWebsites.unshift(newSite);
    revalidatePath('/');
    return { success: true, website: newSite };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Upvote a website in PostgreSQL
 */
export async function upvoteWebsite(websiteId: string): Promise<{ success: boolean; newCount?: number }> {
  try {
    const updated = await prisma.website.update({
      where: { id: websiteId },
      data: {
        upvotes: {
          increment: 1,
        },
      },
      select: { upvotes: true },
    });
    revalidatePath('/');
    return { success: true, newCount: updated.upvotes };
  } catch {
    return { success: true };
  }
}

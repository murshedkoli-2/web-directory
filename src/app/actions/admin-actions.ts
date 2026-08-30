'use server'

import { prisma } from '@/lib/prisma';
import { Category, PricingType, Website } from '@/types';
import { Pricing } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export interface AdminWebsiteInput {
  name: string;
  url: string;
  categoryId: string;
  pricing: PricingType;
  rating?: number;
  featured?: boolean;
  description: string;
  longDescription?: string;
  tags: string[];
  keyFeatures: string[];
  iconBg?: string;
  iconText?: string;
}

export interface AdminDashboardData {
  websites: Website[];
  categories: Category[];
  stats: {
    totalWebsites: number;
    totalCategories: number;
    totalTags: number;
    totalUpvotes: number;
    featuredCount: number;
  };
}

/**
 * Fetch all data for the Admin Dashboard from Neon PostgreSQL
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const [websites, categories, tagCount, upvotesAggregate] = await Promise.all([
      prisma.website.findMany({
        include: {
          category: true,
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { websites: true } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.tag.count(),
      prisma.website.aggregate({
        _sum: { upvotes: true },
      }),
    ]);

    const formattedWebsites: Website[] = websites.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      url: s.url,
      domain: s.domain,
      description: s.description,
      longDescription: s.longDescription,
      categoryId: s.categoryId,
      category: s.category ? {
        id: s.category.id,
        slug: s.category.slug,
        name: s.category.name,
        icon: s.category.icon,
        color: s.category.color,
      } : undefined,
      pricing: s.pricing as PricingType,
      rating: s.rating,
      upvotes: s.upvotes,
      featured: s.featured,
      iconBg: s.iconBg,
      iconText: s.iconText,
      bannerGradient: s.bannerGradient,
      keyFeatures: s.keyFeatures,
      tags: s.tags.map((t) => t.name),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

    const formattedCategories: Category[] = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      color: c.color,
      _count: { websites: c._count.websites },
    }));

    return {
      websites: formattedWebsites,
      categories: formattedCategories,
      stats: {
        totalWebsites: websites.length,
        totalCategories: categories.length,
        totalTags: tagCount,
        totalUpvotes: upvotesAggregate._sum.upvotes || 0,
        featuredCount: websites.filter((s) => s.featured).length,
      },
    };
  } catch (error) {
    console.error('Error fetching admin dashboard data from Neon:', error);
    throw new Error('Failed to fetch admin dashboard data.');
  }
}

/**
 * Create a new website in Neon PostgreSQL
 */
export async function createAdminWebsite(input: AdminWebsiteInput): Promise<{ success: boolean; website?: Website; error?: string }> {
  try {
    const cleanUrl = input.url.trim().startsWith('http') ? input.url.trim() : `https://${input.url.trim()}`;
    const domain = cleanUrl.replace(/^https?:\/\//i, '').split('/')[0];
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const tagConnectOrCreate = input.tags.map((t) => {
      const s = t.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        where: { slug: s },
        create: { name: t, slug: s },
      };
    });

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
        rating: input.rating ?? 5.0,
        featured: input.featured ?? false,
        upvotes: 0,
        iconBg: input.iconBg || '#6366f1',
        iconText: input.iconText || input.name.trim().slice(0, 2).toUpperCase(),
        bannerGradient: `linear-gradient(135deg, ${input.iconBg || '#6366f1'} 0%, #1e1b4b 100%)`,
        keyFeatures: input.keyFeatures.length > 0 ? input.keyFeatures : ['Verified Resource'],
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin');

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
        category: created.category ? {
          id: created.category.id,
          slug: created.category.slug,
          name: created.category.name,
          icon: created.category.icon,
          color: created.category.color,
        } : undefined,
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
  } catch (error) {
    console.error('Error creating admin website:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Update an existing website in Neon PostgreSQL
 */
export async function updateAdminWebsite(
  id: string,
  input: AdminWebsiteInput
): Promise<{ success: boolean; website?: Website; error?: string }> {
  try {
    const cleanUrl = input.url.trim().startsWith('http') ? input.url.trim() : `https://${input.url.trim()}`;
    const domain = cleanUrl.replace(/^https?:\/\//i, '').split('/')[0];

    const tagConnectOrCreate = input.tags.map((t) => {
      const s = t.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        where: { slug: s },
        create: { name: t, slug: s },
      };
    });

    const updated = await prisma.website.update({
      where: { id },
      data: {
        name: input.name.trim(),
        url: cleanUrl,
        domain,
        description: input.description.trim(),
        longDescription: input.longDescription?.trim() || input.description.trim(),
        categoryId: input.categoryId,
        pricing: input.pricing as Pricing,
        rating: input.rating ?? 5.0,
        featured: input.featured ?? false,
        iconBg: input.iconBg || '#6366f1',
        iconText: input.iconText || input.name.trim().slice(0, 2).toUpperCase(),
        bannerGradient: `linear-gradient(135deg, ${input.iconBg || '#6366f1'} 0%, #1e1b4b 100%)`,
        keyFeatures: input.keyFeatures,
        tags: {
          set: [], // Clear existing relations
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin');

    return {
      success: true,
      website: {
        id: updated.id,
        slug: updated.slug,
        name: updated.name,
        url: updated.url,
        domain: updated.domain,
        description: updated.description,
        longDescription: updated.longDescription,
        categoryId: updated.categoryId,
        category: updated.category ? {
          id: updated.category.id,
          slug: updated.category.slug,
          name: updated.category.name,
          icon: updated.category.icon,
          color: updated.category.color,
        } : undefined,
        pricing: updated.pricing as PricingType,
        rating: updated.rating,
        upvotes: updated.upvotes,
        featured: updated.featured,
        iconBg: updated.iconBg,
        iconText: updated.iconText,
        bannerGradient: updated.bannerGradient,
        keyFeatures: updated.keyFeatures,
        tags: updated.tags.map((t) => t.name),
        createdAt: updated.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error('Error updating website in Neon:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Delete a website from Neon PostgreSQL
 */
export async function deleteAdminWebsite(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.website.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Error deleting website in Neon:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Toggle featured state for a website
 */
export async function toggleFeaturedWebsite(id: string, featured: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.website.update({
      where: { id },
      data: { featured },
    });

    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

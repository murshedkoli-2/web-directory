export type PricingType = 'FREE' | 'FREEMIUM' | 'PAID' | 'OPEN_SOURCE';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  icon: string;
  color: string;
  _count?: {
    websites: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Website {
  id: string;
  slug: string;
  name: string;
  url: string;
  domain: string;
  description: string;
  longDescription?: string | null;
  categoryId: string;
  category?: Category;
  pricing: PricingType;
  rating: number;
  upvotes: number;
  featured: boolean;
  iconBg: string;
  iconText: string;
  bannerGradient?: string | null;
  keyFeatures: string[];
  tags: (Tag | string)[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isUpvoted?: boolean;
  isBookmarked?: boolean;
}

export interface SubmitWebsiteInput {
  name: string;
  url: string;
  categoryId: string;
  pricing: PricingType;
  description: string;
  longDescription?: string;
  tags: string[];
  keyFeatures: string[];
}

export interface FilterState {
  category: string;
  search: string;
  pricing: string;
  tag: string | null;
  sortBy: 'popular' | 'rating' | 'newest' | 'name';
  bookmarksOnly: boolean;
}

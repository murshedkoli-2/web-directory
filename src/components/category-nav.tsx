"use client"

import React from 'react'
import { Category } from '@/types'
import {
  Sparkles,
  Bot,
  Code2,
  Palette,
  Zap,
  Rocket,
  TrendingUp,
  GraduationCap,
  GitBranch,
  Cpu,
  Film,
  Folder,
  Shield,
} from 'lucide-react'

interface CategoryNavProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (slug: string) => void
  totalCount: number
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  totalCount,
}: CategoryNavProps) {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'all':
        return <Sparkles className="h-4 w-4" />
      case 'ai-ml':
        return <Bot className="h-4 w-4" />
      case 'dev-tools':
        return <Code2 className="h-4 w-4" />
      case 'design-ui':
        return <Palette className="h-4 w-4" />
      case 'productivity':
        return <Zap className="h-4 w-4" />
      case 'tech-startups':
        return <Rocket className="h-4 w-4" />
      case 'marketing-seo':
        return <TrendingUp className="h-4 w-4" />
      case 'education':
        return <GraduationCap className="h-4 w-4" />
      case 'open-source':
        return <GitBranch className="h-4 w-4" />
      case 'utilities-apis':
        return <Cpu className="h-4 w-4" />
      case 'media-entertainment':
        return <Film className="h-4 w-4" />
      case 'govt-services':
        return <Shield className="h-4 w-4" />
      default:
        return <Folder className="h-4 w-4" />
    }
  }

  const allCategoryItem = {
    id: 'all',
    slug: 'all',
    name: 'All Categories',
    icon: 'Sparkles',
    color: 'from-blue-500 to-indigo-600',
    _count: { websites: totalCount },
  }

  const items = [allCategoryItem, ...categories]

  return (
    <div className="mb-6 w-full">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-border">
        {items.map((cat) => {
          const isSelected = selectedCategory === cat.slug
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-card/70 border border-border/70 text-muted-foreground hover:bg-secondary/90 hover:text-foreground hover:border-border'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-indigo-400'}>
                {getCategoryIcon(cat.slug)}
              </span>
              <span>{cat.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {cat._count?.websites ?? 0}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

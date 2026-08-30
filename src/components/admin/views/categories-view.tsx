"use client"

import React from 'react'
import { Category, Website } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  ArrowRight,
  Shield,
} from 'lucide-react'
import { AdminViewType } from '../admin-sidebar'

interface CategoriesViewProps {
  categories: Category[]
  websites: Website[]
  onSelectCategoryFilter: (categorySlug: string) => void
}

export function CategoriesView({
  categories,
  websites,
  onSelectCategoryFilter,
}: CategoriesViewProps) {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'ai-ml':
        return <Bot className="h-5 w-5" />
      case 'dev-tools':
        return <Code2 className="h-5 w-5" />
      case 'design-ui':
        return <Palette className="h-5 w-5" />
      case 'productivity':
        return <Zap className="h-5 w-5" />
      case 'tech-startups':
        return <Rocket className="h-5 w-5" />
      case 'marketing-seo':
        return <TrendingUp className="h-5 w-5" />
      case 'education':
        return <GraduationCap className="h-5 w-5" />
      case 'open-source':
        return <GitBranch className="h-5 w-5" />
      case 'utilities-apis':
        return <Cpu className="h-5 w-5" />
      case 'media-entertainment':
        return <Film className="h-5 w-5" />
      case 'govt-services':
        return <Shield className="h-5 w-5" />
      default:
        return <Folder className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          Categories Manager
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Overview of all 10 core taxonomy categories in your Neon database catalog.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const siteCount = cat._count?.websites ?? 0
          return (
            <Card
              key={cat.id}
              className="border-border/70 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs font-bold">
                    {siteCount} {siteCount === 1 ? 'Site' : 'Sites'}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-foreground mt-3">
                  {cat.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                  {cat.description || 'Curated category resources'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                  <span className="font-mono text-muted-foreground text-[11px]">
                    slug: /{cat.slug}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectCategoryFilter(cat.slug)}
                    className="gap-1 h-8 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    <span>Filter Table</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

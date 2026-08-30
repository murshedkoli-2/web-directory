"use client"

import React from 'react'
import Link from 'next/link'
import { Category, Website } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Globe,
  Layers,
  Tags,
  ThumbsUp,
  Sparkles,
  Star,
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { AdminViewType } from '../admin-sidebar'

interface DashboardViewProps {
  stats: {
    totalWebsites: number
    totalCategories: number
    totalTags: number
    totalUpvotes: number
    featuredCount: number
  }
  websites: Website[]
  categories: Category[]
  onSelectView: (view: AdminViewType) => void
  onEditWebsite: (website: Website) => void
}

export function DashboardView({
  stats,
  websites,
  categories,
  onSelectView,
  onEditWebsite,
}: DashboardViewProps) {
  // Top 5 by Upvotes
  const topUpvoted = [...websites].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5)

  // 5 Most Recently Added
  const recentWebsites = [...websites]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-background p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live Neon PostgreSQL Operations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              WebNexus Directory Control Center
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              You are managing <strong>{stats.totalWebsites}</strong> curated resources across{' '}
              <strong>{stats.totalCategories}</strong> categories with <strong>{stats.totalTags}</strong> relational tags.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/websites/new">
              <Button
                variant="glow"
                className="gap-2 rounded-xl font-bold shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Add Resource</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-500/15 to-transparent backdrop-blur-xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Websites
              </p>
              <h3 className="mt-1 text-3xl font-black font-mono text-foreground">
                {stats.totalWebsites}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Globe className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-transparent backdrop-blur-xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categories
              </p>
              <h3 className="mt-1 text-3xl font-black font-mono text-foreground">
                {stats.totalCategories}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Layers className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/15 to-transparent backdrop-blur-xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Unique Tags
              </p>
              <h3 className="mt-1 text-3xl font-black font-mono text-foreground">
                {stats.totalTags}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Tags className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-transparent backdrop-blur-xl">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Upvotes
              </p>
              <h3 className="mt-1 text-3xl font-black font-mono text-foreground">
                {stats.totalUpvotes}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ThumbsUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout: Top Ranked & Category Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Upvoted Websites */}
        <Card className="border-border/70 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">🔥 Most Popular Resources</CardTitle>
              <CardDescription className="text-xs">
                Top rated and upvoted websites by community engagement
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectView('websites')}
              className="gap-1 text-xs text-indigo-400"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topUpvoted.map((site, index) => (
              <div
                key={site.id}
                onClick={() => onEditWebsite(site)}
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-secondary/40 hover:bg-secondary/80 hover:border-indigo-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary font-mono text-xs font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-bold text-white text-xs"
                    style={{ backgroundColor: site.iconBg || '#6366f1' }}
                  >
                    {site.iconText || site.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground text-xs sm:text-sm truncate">
                      {site.name}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground truncate">
                      {site.domain}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {site.category?.name || 'Category'}
                  </Badge>
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-pink-400">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{site.upvotes}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Breakdown Progress */}
        <Card className="border-border/70 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">📊 Category Distribution</CardTitle>
              <CardDescription className="text-xs">
                Resource volume per category across the directory
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectView('categories')}
              className="gap-1 text-xs text-indigo-400"
            >
              <span>Manage</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {categories.map((cat) => {
              const count = cat._count?.websites ?? 0
              const percentage = stats.totalWebsites > 0 ? Math.round((count / stats.totalWebsites) * 100) : 0
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{cat.name}</span>
                    <span className="font-mono text-muted-foreground">
                      <strong>{count}</strong> ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recently Added Section */}
      <Card className="border-border/70 bg-card/60 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-bold">⚡ Recently Added Resources</CardTitle>
            <CardDescription className="text-xs">
              Latest submissions synchronized to your Neon database
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectView('websites')}
            className="text-xs rounded-xl"
          >
            Catalog Table →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentWebsites.map((site) => (
              <div
                key={site.id}
                onClick={() => onEditWebsite(site)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/70 hover:border-indigo-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg font-bold text-white text-xs"
                    style={{ backgroundColor: site.iconBg || '#6366f1' }}
                  >
                    {site.iconText || site.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground text-xs truncate">
                      {site.name}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground truncate">
                      {site.domain}
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px]">
                  {site.pricing}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

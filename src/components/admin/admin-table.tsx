"use client"

import React, { useState, useMemo } from 'react'
import { Category, Website } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Search,
  Sparkles,
  ExternalLink,
  Edit2,
  Trash2,
  Star,
  ChevronUp,
  Filter,
  CheckCircle2,
} from 'lucide-react'
import { toggleFeaturedWebsite } from '@/app/actions/admin-actions'
import { toast } from 'sonner'

interface AdminTableProps {
  websites: Website[]
  categories: Category[]
  onEditWebsite: (website: Website) => void
  onDeleteWebsite: (website: Website) => void
  onRefresh: () => void
}

export function AdminTable({
  websites,
  categories,
  onEditWebsite,
  onDeleteWebsite,
  onRefresh,
}: AdminTableProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPricing, setSelectedPricing] = useState('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  // Filtered List
  const filteredList = useMemo(() => {
    return websites.filter((site) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchName = site.name.toLowerCase().includes(q)
        const matchDomain = site.domain.toLowerCase().includes(q)
        const matchDesc = site.description.toLowerCase().includes(q)
        const matchTag = site.tags.some((t) =>
          (typeof t === 'string' ? t : t.name).toLowerCase().includes(q)
        )
        if (!matchName && !matchDomain && !matchDesc && !matchTag) return false
      }

      // Category
      if (selectedCategory !== 'all') {
        if (
          site.categoryId !== selectedCategory &&
          site.categoryId !== `cat-${selectedCategory}` &&
          site.category?.slug !== selectedCategory
        ) {
          return false
        }
      }

      // Pricing
      if (selectedPricing !== 'all') {
        if (site.pricing.toLowerCase() !== selectedPricing.toLowerCase()) return false
      }

      // Featured
      if (featuredOnly && !site.featured) return false

      return true
    })
  }, [websites, search, selectedCategory, selectedPricing, featuredOnly])

  const handleToggleFeatured = async (site: Website) => {
    const nextState = !site.featured
    const res = await toggleFeaturedWebsite(site.id, nextState)
    if (res.success) {
      toast.success(`Updated featured status for "${site.name}"`)
      onRefresh()
    } else {
      toast.error('Failed to update featured status.')
    }
  }

  const getPricingVariant = (pricing: string) => {
    switch (pricing.toUpperCase()) {
      case 'FREE':
        return 'free'
      case 'FREEMIUM':
        return 'freemium'
      case 'PAID':
        return 'paid'
      case 'OPEN_SOURCE':
        return 'openSource'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur-xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, domain, or tag..."
            className="pl-9 h-10 rounded-xl bg-secondary/50 text-xs sm:text-sm"
          />
        </div>

        {/* Category Select */}
        <div className="w-[180px]">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10 rounded-xl bg-secondary/50 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs">
                All Categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="text-xs">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pricing Select */}
        <div className="w-[140px]">
          <Select value={selectedPricing} onValueChange={setSelectedPricing}>
            <SelectTrigger className="h-10 rounded-xl bg-secondary/50 text-xs">
              <SelectValue placeholder="All Pricing" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs">
                All Pricing
              </SelectItem>
              <SelectItem value="free" className="text-xs">
                Free
              </SelectItem>
              <SelectItem value="freemium" className="text-xs">
                Freemium
              </SelectItem>
              <SelectItem value="paid" className="text-xs">
                Paid
              </SelectItem>
              <SelectItem value="open_source" className="text-xs">
                Open Source
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Toggle */}
        <Button
          variant={featuredOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFeaturedOnly(!featuredOnly)}
          className={`h-10 gap-1.5 rounded-xl text-xs ${
            featuredOnly ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Featured Only</span>
        </Button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl shadow-xl">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-border/80 bg-secondary/60 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-4">Resource</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Pricing</th>
              <th className="px-4 py-4">Rating</th>
              <th className="px-4 py-4">Upvotes</th>
              <th className="px-4 py-4 text-center">Featured</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                  No websites matching current filters found.
                </td>
              </tr>
            ) : (
              filteredList.map((site) => (
                <tr
                  key={site.id}
                  className="hover:bg-secondary/30 transition-colors group"
                >
                  {/* Resource Name + Icon + Domain */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg font-bold text-white text-xs shadow-sm"
                        style={{ backgroundColor: site.iconBg || '#6366f1' }}
                      >
                        {site.iconText || site.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 max-w-[200px] sm:max-w-[260px]">
                        <div className="font-bold text-foreground truncate group-hover:text-indigo-400 transition-colors">
                          {site.name}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground truncate">
                          {site.domain}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-semibold text-foreground/90 whitespace-nowrap border border-border/50">
                      {site.category?.name || 'Category'}
                    </span>
                  </td>

                  {/* Pricing Badge */}
                  <td className="px-4 py-4">
                    <Badge variant={getPricingVariant(site.pricing)}>
                      {site.pricing.replace('_', ' ')}
                    </Badge>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 font-mono font-semibold text-foreground">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{site.rating.toFixed(1)}</span>
                    </div>
                  </td>

                  {/* Upvotes */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 font-mono font-semibold text-pink-400">
                      <ChevronUp className="h-4 w-4" />
                      <span>{site.upvotes}</span>
                    </div>
                  </td>

                  {/* Featured Toggle */}
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(site)}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                        site.featured
                          ? 'border-amber-500/50 bg-amber-500/20 text-amber-400 shadow-sm'
                          : 'border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground'
                      }`}
                      title={site.featured ? 'Remove featured' : 'Make featured'}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </button>
                  </td>

                  {/* Actions (Edit, Delete, Visit) */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditWebsite(site)}
                        className="h-8 w-8 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/15"
                        title="Edit website"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteWebsite(site)}
                        className="h-8 w-8 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/15"
                        title="Delete website"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>

                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                        title="Open external website"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
        <span>
          Showing <strong className="text-foreground">{filteredList.length}</strong> of{' '}
          <strong className="text-foreground">{websites.length}</strong> resources in Neon DB
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" /> Connected to Neon PostgreSQL
        </span>
      </div>
    </div>
  )
}

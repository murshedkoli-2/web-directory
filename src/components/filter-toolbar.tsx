"use client"

import React from 'react'
import { PricingType } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Flame, Star, Clock, ArrowDownAZ } from 'lucide-react'

interface FilterToolbarProps {
  selectedPricing: string
  onSelectPricing: (pricing: string) => void
  selectedTag: string | null
  onClearTag: () => void
  sortBy: string
  onSortChange: (sort: string) => void
  resultsCount: number
}

export function FilterToolbar({
  selectedPricing,
  onSelectPricing,
  selectedTag,
  onClearTag,
  sortBy,
  onSortChange,
  resultsCount,
}: FilterToolbarProps) {
  const pricingOptions: { label: string; value: string }[] = [
    { label: 'All Pricing', value: 'all' },
    { label: 'Free', value: 'free' },
    { label: 'Freemium', value: 'freemium' },
    { label: 'Paid', value: 'paid' },
    { label: 'Open Source', value: 'open_source' },
  ]

  return (
    <div className="space-y-4 mb-6 pb-4 border-b border-border/60">
      {/* Active Tag Filter Indicator */}
      {selectedTag && (
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400 animate-in fade-in">
          <span>Filtering by tag: <strong>#{selectedTag}</strong></span>
          <button
            onClick={onClearTag}
            className="rounded-full p-0.5 hover:bg-pink-500/20 transition-colors"
            title="Remove tag filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Pricing Filters & Sort Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Pricing Option Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {pricingOptions.map((opt) => {
            const isActive = selectedPricing.toLowerCase() === opt.value.toLowerCase()
            return (
              <button
                key={opt.value}
                onClick={() => onSelectPricing(opt.value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-sm'
                    : 'bg-card/60 text-muted-foreground border border-border/60 hover:text-foreground hover:bg-secondary'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Results Counter & Sort Selector */}
        <div className="flex items-center gap-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing <strong className="font-mono text-foreground font-bold">{resultsCount}</strong> resources
          </div>

          <div className="w-[170px]">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="h-9 rounded-xl border-border/80 bg-card/80 text-xs font-medium">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="popular" className="text-xs">
                  <div className="flex items-center gap-2">
                    <Flame className="h-3.5 w-3.5 text-orange-400" />
                    <span>Most Popular</span>
                  </div>
                </SelectItem>
                <SelectItem value="rating" className="text-xs">
                  <div className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-amber-400" />
                    <span>Highest Rated</span>
                  </div>
                </SelectItem>
                <SelectItem value="newest" className="text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Newly Added</span>
                  </div>
                </SelectItem>
                <SelectItem value="name" className="text-xs">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Alphabetical (A-Z)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

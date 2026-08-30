"use client"

import React, { useState, useMemo } from 'react'
import { Website } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Tags, ArrowRight } from 'lucide-react'

interface TagsViewProps {
  websites: Website[]
  onSelectTagFilter: (tagName: string) => void
}

export function TagsView({ websites, onSelectTagFilter }: TagsViewProps) {
  const [search, setSearch] = useState('')

  // Aggregate tags with counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    websites.forEach((site) => {
      site.tags.forEach((tag) => {
        const name = typeof tag === 'string' ? tag : tag.name
        counts[name] = (counts[name] || 0) + 1
      })
    })

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [websites])

  const filteredTags = useMemo(() => {
    if (!search.trim()) return tagCounts
    return tagCounts.filter((t) => t.name.toLowerCase().includes(search.toLowerCase().trim()))
  }, [tagCounts, search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Tags & Taxonomy
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Explore <strong>{tagCounts.length}</strong> unique tags mapped across your Neon database.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags..."
            className="pl-9 h-10 rounded-xl bg-secondary/50 text-xs"
          />
        </div>
      </div>

      {/* Tag Cloud Card */}
      <Card className="border-border/70 bg-card/60 backdrop-blur-xl p-6">
        <div className="flex flex-wrap gap-2.5">
          {filteredTags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => onSelectTagFilter(tag.name)}
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/50 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-500/50 transition-all cursor-pointer select-none group"
            >
              <span>#{tag.name}</span>
              <span className="rounded-md bg-secondary/90 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground group-hover:bg-white/20 group-hover:text-white transition-colors">
                {tag.count}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

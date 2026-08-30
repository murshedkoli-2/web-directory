"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Website } from '@/types'
import { WebsiteCard } from './website-card'
import { SearchX, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WebsiteGridProps {
  websites: Website[]
  bookmarkedIds: string[]
  upvotedIds: string[]
  onSelectWebsite: (website: Website) => void
  onToggleBookmark: (id: string) => void
  onToggleUpvote: (id: string) => void
  onFilterTag: (tag: string) => void
  onResetFilters: () => void
}

export function WebsiteGrid({
  websites,
  bookmarkedIds,
  upvotedIds,
  onSelectWebsite,
  onToggleBookmark,
  onToggleUpvote,
  onFilterTag,
  onResetFilters,
}: WebsiteGridProps) {
  if (websites.length === 0) {
    return (
      <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center backdrop-blur-xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground mb-4 shadow-inner">
          <SearchX className="h-8 w-8 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No matching websites found</h3>
        <p className="max-w-md text-sm text-muted-foreground mb-6">
          We couldn't find any resources matching your search and filter criteria. Try adjusting your query or resetting all filters.
        </p>
        <Button onClick={onResetFilters} variant="default" className="gap-2 rounded-xl">
          <RotateCcw className="h-4 w-4" />
          <span>Reset All Filters</span>
        </Button>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      style={{ perspective: '1500px' }}
    >
      {websites.map((site, idx) => (
        <motion.div
          key={site.id}
          initial={{ opacity: 0, rotateX: -55, y: 60 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -80px 0px' }}
          transition={{
            duration: 0.55,
            delay: (idx % 6) * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'top center' }}
        >
          <WebsiteCard
            website={site}
            isBookmarked={bookmarkedIds.includes(site.id)}
            isUpvoted={upvotedIds.includes(site.id)}
            onSelect={onSelectWebsite}
            onToggleBookmark={onToggleBookmark}
            onToggleUpvote={onToggleUpvote}
            onFilterTag={onFilterTag}
          />
        </motion.div>
      ))}
    </div>
  )
}

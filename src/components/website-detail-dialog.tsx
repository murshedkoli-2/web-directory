"use client"

import React from 'react'
import { Website } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, ExternalLink, Bookmark, ChevronUp, Share2, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface WebsiteDetailDialogProps {
  website: Website | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isBookmarked: boolean
  isUpvoted: boolean
  onToggleBookmark: (id: string) => void
  onToggleUpvote: (id: string) => void
  onFilterTag: (tag: string) => void
}

export function WebsiteDetailDialog({
  website,
  open,
  onOpenChange,
  isBookmarked,
  isUpvoted,
  onToggleBookmark,
  onToggleUpvote,
  onFilterTag,
}: WebsiteDetailDialogProps) {
  if (!website) return null

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(website.url)
      toast.success(`Copied ${website.name} link to clipboard!`)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-border/80 bg-card/95 backdrop-blur-2xl">
        {/* Banner Header */}
        <div
          className="h-28 w-full relative p-6 flex items-end"
          style={{
            background:
              website.bannerGradient ||
              'linear-gradient(135deg, #6366f1 0%, #1e1b4b 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />

          <div className="relative z-10 flex items-center gap-4">
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl font-bold text-white shadow-xl text-xl"
              style={{ backgroundColor: website.iconBg || '#6366f1' }}
            >
              {website.iconText || website.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <DialogTitle className="text-2xl font-extrabold text-foreground">
                {website.name}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-mono text-xs text-muted-foreground">
                  {website.domain}
                </span>
                <Badge variant={getPricingVariant(website.pricing)}>
                  {website.pricing.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog Body */}
        <div className="p-6 space-y-6">
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Overview
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {website.longDescription || website.description}
            </p>
          </div>

          {/* Key Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              Key Highlights & Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(website.keyFeatures && website.keyFeatures.length > 0
                ? website.keyFeatures
                : ['Verified Directory Resource', 'Active Web Domain', 'Direct Access']
              ).map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-secondary/40 px-3.5 py-2 text-xs text-foreground/80"
                >
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags & Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Tags & Topics
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {website.tags.map((tag, idx) => {
                const tagName = typeof tag === 'string' ? tag : tag.name
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onOpenChange(false)
                      onFilterTag(tagName)
                    }}
                    className="rounded-lg border border-border/70 bg-secondary/70 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-indigo-400 hover:border-indigo-500/50 transition-colors"
                  >
                    #{tagName}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/60">
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <span>Visit Website</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <Button
              variant={isUpvoted ? "secondary" : "outline"}
              onClick={() => onToggleUpvote(website.id)}
              className={`h-11 px-4 gap-1.5 rounded-xl ${
                isUpvoted ? 'text-pink-500 bg-pink-500/10 border-pink-500/30' : ''
              }`}
            >
              <ChevronUp className="h-4 w-4" />
              <span>{website.upvotes + (isUpvoted ? (website.isUpvoted ? 0 : 1) : 0)} Upvote</span>
            </Button>

            <Button
              variant={isBookmarked ? "secondary" : "outline"}
              onClick={() => onToggleBookmark(website.id)}
              className={`h-11 px-4 gap-1.5 rounded-xl ${
                isBookmarked ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : ''
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="h-11 w-11 rounded-xl"
              title="Copy URL"
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

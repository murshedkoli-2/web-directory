"use client"

import React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Website } from '@/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ExternalLink, Bookmark, ChevronUp, Sparkles } from 'lucide-react'

interface WebsiteCardProps {
  website: Website
  isBookmarked: boolean
  isUpvoted: boolean
  onSelect: (website: Website) => void
  onToggleBookmark: (id: string) => void
  onToggleUpvote: (id: string) => void
  onFilterTag: (tag: string) => void
}

export function WebsiteCard({
  website,
  isBookmarked,
  isUpvoted,
  onSelect,
  onToggleBookmark,
  onToggleUpvote,
  onFilterTag,
}: WebsiteCardProps) {
  const getPricingBadgeVariant = (pricing: string) => {
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

  // 3D tilt-toward-pointer, with the icon/title lifted onto a nearer depth plane
  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mvY, [0, 1], [10, -10]), { stiffness: 250, damping: 22 })
  const rotateY = useSpring(useTransform(mvX, [0, 1], [-10, 10]), { stiffness: 250, damping: 22 })
  const glareX = useTransform(mvX, [0, 1], [0, 100])
  const glareY = useTransform(mvY, [0, 1], [0, 100])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mvX.set((e.clientX - rect.left) / rect.width)
    mvY.set((e.clientY - rect.top) / rect.height)
  }
  const handleMouseLeave = () => {
    mvX.set(0.5)
    mvY.set(0.5)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        <Card className="group relative flex h-full flex-col overflow-hidden border-border/70 bg-card/60 transition-shadow duration-300 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10">
          {/* Pointer-follow glare — sells the tilted glass surface */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]: number[]) =>
                  `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.08), transparent 60%)`
              ),
            }}
          />
          {/* Banner Preview */}
          <div
            className="h-20 w-full relative overflow-hidden flex items-end px-4 pb-2"
            style={{
              background:
                website.bannerGradient ||
                'linear-gradient(135deg, #6366f1 0%, #1e1b4b 100%)',
              transform: 'translateZ(20px)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

            {website.featured && (
              <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                <Sparkles className="h-3 w-3" />
                <span>Featured</span>
              </div>
            )}
          </div>

          {/* Card Body */}
          <CardContent className="flex-1 p-5 pt-3" style={{ transform: 'translateZ(30px)' }}>
        {/* Head: Icon + Title + Domain */}
        <div className="flex items-start gap-3.5 mb-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-md text-sm"
            style={{ backgroundColor: website.iconBg || '#6366f1' }}
          >
            {website.iconText || website.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              onClick={() => onSelect(website)}
              className="text-base font-bold text-foreground hover:text-indigo-400 cursor-pointer transition-colors truncate"
              title={website.name}
            >
              {website.name}
            </h3>
            <span className="block text-xs font-mono text-muted-foreground truncate">
              {website.domain}
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {website.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {website.tags.slice(0, 3).map((tag, idx) => {
            const tagName = typeof tag === 'string' ? tag : tag.name
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  onFilterTag(tagName)
                }}
                className="rounded-lg border border-border/60 bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
              >
                #{tagName}
              </button>
            )
          })}
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="flex items-center justify-between border-t border-border/60 bg-secondary/30 px-4 py-3">
        {/* Pricing Badge */}
        <Badge variant={getPricingBadgeVariant(website.pricing)}>
          {website.pricing.replace('_', ' ')}
        </Badge>

        {/* Actions Group */}
        <div className="flex items-center gap-1.5">
          {/* Upvote Button */}
          <Button
            variant={isUpvoted ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onToggleUpvote(website.id)}
            className={`h-8 px-2.5 gap-1 rounded-lg text-xs font-semibold ${
              isUpvoted ? 'text-pink-500 bg-pink-500/10 border-pink-500/30' : 'text-muted-foreground'
            }`}
            title="Upvote website"
          >
            <ChevronUp className={`h-3.5 w-3.5 ${isUpvoted ? 'stroke-[3]' : ''}`} />
            <span>{website.upvotes + (isUpvoted ? (website.isUpvoted ? 0 : 1) : 0)}</span>
          </Button>

          {/* Bookmark Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleBookmark(website.id)}
            className={`h-8 w-8 rounded-lg ${
              isBookmarked ? 'text-amber-400 bg-amber-500/10' : 'text-muted-foreground hover:text-amber-400'
            }`}
            title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </Button>

          {/* External Link */}
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-2.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            <span>Visit</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  )
}

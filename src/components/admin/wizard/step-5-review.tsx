"use client"

import React from 'react'
import { Category, PricingType } from '@/types'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  ExternalLink,
  ChevronUp,
  Bookmark,
  CheckCircle2,
  Database,
  Check,
} from 'lucide-react'

interface Step5ReviewProps {
  name: string
  url: string
  categoryId: string
  pricing: PricingType
  description: string
  longDescription: string
  tags: string[]
  keyFeatures: string[]
  iconText: string
  iconBg: string
  rating: string
  featured: boolean
  categories: Category[]
}

export function Step5Review({
  name,
  url,
  categoryId,
  pricing,
  description,
  longDescription,
  tags,
  keyFeatures,
  iconText,
  iconBg,
  rating,
  featured,
  categories,
}: Step5ReviewProps) {
  const cleanDomain = url.trim()
    ? url.replace(/^https?:\/\//i, '').split('/')[0]
    : 'example.com'

  const selectedCategoryObj = categories.find((c) => c.id === categoryId)
  const categoryName = selectedCategoryObj ? selectedCategoryObj.name : 'Category'
  const displayInitials = iconText.trim() || name.trim().slice(0, 2).toUpperCase() || 'WN'

  const getPricingBadgeVariant = (p: string) => {
    switch (p.toUpperCase()) {
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-bold text-foreground">Step 5: Final Review & Live Card Preview</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Verify all details and review how this resource will look to users in the public directory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left: Realistic Live Card Preview */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Directory Card Preview
          </span>

          <div className="rounded-2xl border border-border/80 bg-card/80 text-card-foreground shadow-2xl backdrop-blur-2xl overflow-hidden">
            {/* Banner */}
            <div
              className="h-20 w-full relative flex items-end px-4 pb-2"
              style={{
                background: `linear-gradient(135deg, ${iconBg} 0%, #1e1b4b 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              {featured && (
                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                  <Sparkles className="h-3 w-3" />
                  <span>Featured</span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-5 pt-3">
              <div className="flex items-start gap-3.5 mb-3">
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-md text-sm"
                  style={{ backgroundColor: iconBg }}
                >
                  {displayInitials}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-bold text-foreground truncate">
                    {name || 'Product Name'}
                  </h4>
                  <span className="block text-xs font-mono text-muted-foreground truncate">
                    {cleanDomain}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                {description || 'No description provided yet.'}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(tags.length > 0 ? tags.slice(0, 3) : ['ExampleTag', 'Tool']).map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-border/60 bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/60 bg-secondary/30 px-4 py-3">
              <Badge variant={getPricingBadgeVariant(pricing)}>
                {pricing.replace('_', ' ')}
              </Badge>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  <ChevronUp className="h-3.5 w-3.5 text-pink-400" />
                  <span>0</span>
                </div>

                <div className="inline-flex h-8 items-center gap-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-2.5 text-xs font-semibold text-indigo-400">
                  <span>Visit</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary Specifications */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Specification Summary
          </span>

          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-border/60">
                <tr className="hover:bg-secondary/20">
                  <td className="px-4 py-3 font-semibold text-muted-foreground w-1/3">Website Name</td>
                  <td className="px-4 py-3 font-bold text-foreground">{name}</td>
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="px-4 py-3 font-semibold text-muted-foreground">Target URL</td>
                  <td className="px-4 py-3 font-mono text-indigo-400 truncate">{url}</td>
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="px-4 py-3 font-semibold text-muted-foreground">Category</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{categoryName}</td>
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="px-4 py-3 font-semibold text-muted-foreground">Pricing Tier</td>
                  <td className="px-4 py-3">
                    <Badge variant={getPricingBadgeVariant(pricing)}>{pricing.replace('_', ' ')}</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="px-4 py-3 font-semibold text-muted-foreground">Initial Rating</td>
                  <td className="px-4 py-3 font-mono font-bold text-foreground">⭐ {rating} / 5.0</td>
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="px-4 py-3 font-semibold text-muted-foreground">Promotional Status</td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {featured ? '🌟 Featured' : 'Standard'}
                  </td>
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="px-4 py-3 font-semibold text-muted-foreground">Tags ({tags.length})</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {tags.map((t, idx) => (
                        <span key={idx} className="font-mono text-[11px] text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="px-4 py-3 font-semibold text-muted-foreground">Highlights ({keyFeatures.length})</td>
                  <td className="px-4 py-3">
                    <ul className="space-y-1">
                      {keyFeatures.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px] text-foreground/80">
                          <Check className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 font-medium">
            <Database className="h-4 w-4 flex-shrink-0" />
            <span>Ready to write new resource record directly to Neon PostgreSQL database.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

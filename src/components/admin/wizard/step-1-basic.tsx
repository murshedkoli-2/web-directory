"use client"

import React from 'react'
import { Category, PricingType } from '@/types'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Globe, Link as LinkIcon, Layers, DollarSign } from 'lucide-react'

interface Step1BasicProps {
  name: string
  setName: (v: string) => void
  url: string
  setUrl: (v: string) => void
  categoryId: string
  setCategoryId: (v: string) => void
  pricing: PricingType
  setPricing: (v: PricingType) => void
  categories: Category[]
}

export function Step1Basic({
  name,
  setName,
  url,
  setUrl,
  categoryId,
  setCategoryId,
  pricing,
  setPricing,
  categories,
}: Step1BasicProps) {
  const cleanDomain = url.trim()
    ? url.replace(/^https?:\/\//i, '').split('/')[0]
    : 'example.com'

  const pricingTiers: { id: PricingType; label: string; desc: string; badge: string }[] = [
    { id: 'FREE', label: '100% Free', desc: 'Completely free for all users', badge: 'free' },
    { id: 'FREEMIUM', label: 'Freemium', desc: 'Free tier with premium upgrades', badge: 'freemium' },
    { id: 'PAID', label: 'Paid / Subscription', desc: 'Requires paid license or plan', badge: 'paid' },
    { id: 'OPEN_SOURCE', label: 'Open Source', desc: 'Public source code & community license', badge: 'openSource' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-bold text-foreground">Step 1: General & Basic Information</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Enter the essential identity and URL of the website resource.
        </p>
      </div>

      {/* Row: Name & URL */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
            <Globe className="h-3.5 w-3.5 text-indigo-400" />
            <span>Website / Product Name *</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Supabase, Linear, Figma"
            className="h-12 rounded-xl text-sm"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <LinkIcon className="h-3.5 w-3.5 text-indigo-400" />
              <span>Website URL *</span>
            </label>
            {url.trim() && (
              <span className="font-mono text-[11px] text-muted-foreground truncate">
                Domain: <strong className="text-indigo-400">{cleanDomain}</strong>
              </span>
            )}
          </div>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://supabase.com"
            className="h-12 rounded-xl text-sm"
            required
          />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2.5">
          <Layers className="h-3.5 w-3.5 text-purple-400" />
          <span>Category *</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {categories.map((cat) => {
            const isSelected = categoryId === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/15 shadow-md text-foreground'
                    : 'border-border/60 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span className="text-xs font-bold truncate w-full">{cat.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  {cat._count?.websites ?? 0} sites
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Pricing Model Selector */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2.5">
          <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          <span>Pricing Model *</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pricingTiers.map((tier) => {
            const isSelected = pricing === tier.id
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setPricing(tier.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/15 shadow-md'
                    : 'border-border/60 bg-secondary/40 hover:bg-secondary'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground">{tier.label}</span>
                  <Badge variant={tier.badge as any}>{tier.id.replace('_', ' ')}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{tier.desc}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

"use client"

import React from 'react'
import { Input } from '@/components/ui/input'
import { Palette, Star, Sparkles, Image as ImageIcon } from 'lucide-react'

interface Step4BrandingProps {
  iconText: string
  setIconText: (v: string) => void
  iconBg: string
  setIconBg: (v: string) => void
  rating: string
  setRating: (v: string) => void
  featured: boolean
  setFeatured: (v: boolean) => void
  websiteName: string
}

export function Step4Branding({
  iconText,
  setIconText,
  iconBg,
  setIconBg,
  rating,
  setRating,
  featured,
  setFeatured,
  websiteName,
}: Step4BrandingProps) {
  const colorPresets = [
    { label: 'Indigo', hex: '#6366f1' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Purple', hex: '#8b5cf6' },
    { label: 'Amber', hex: '#f59e0b' },
    { label: 'Rose', hex: '#f43f5e' },
    { label: 'Cyan', hex: '#06b6d4' },
    { label: 'Pink', hex: '#ec4899' },
    { label: 'Dark Slate', hex: '#0f172a' },
  ]

  const displayInitials = iconText.trim() || websiteName.trim().slice(0, 2).toUpperCase() || 'WN'

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-bold text-foreground">Step 4: Branding & Metadata Customizer</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Customize the visual avatar, accent color, rating, and promotional status.
        </p>
      </div>

      {/* Row: Avatar Customizer & Live Icon Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-xl">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
              <Palette className="h-3.5 w-3.5 text-indigo-400" />
              <span>Avatar Initials / Emoji</span>
            </label>
            <Input
              value={iconText}
              onChange={(e) => setIconText(e.target.value)}
              placeholder="e.g. SB, ⚡, ▲"
              maxLength={4}
              className="h-11 rounded-xl text-sm"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              If left blank, first 2 letters of product name will be used.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Color Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setIconBg(preset.hex)}
                  className={`h-8 w-8 rounded-xl border-2 transition-transform cursor-pointer ${
                    iconBg.toLowerCase() === preset.hex.toLowerCase()
                      ? 'scale-110 border-white shadow-lg'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                  title={preset.label}
                />
              ))}

              <div className="flex items-center gap-1.5 ml-1">
                <input
                  type="color"
                  value={iconBg}
                  onChange={(e) => setIconBg(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-xl border border-border bg-transparent p-0.5"
                />
                <span className="font-mono text-xs text-muted-foreground">{iconBg}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Icon Avatar Preview Box */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-border/50 bg-secondary/30 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl font-extrabold text-white text-xl shadow-xl mb-3 transition-transform"
            style={{ backgroundColor: iconBg }}
          >
            {displayInitials}
          </div>
          <span className="text-xs font-bold text-foreground">Avatar Preview</span>
          <span className="font-mono text-[11px] text-muted-foreground">{iconBg}</span>
        </div>
      </div>

      {/* Row: Rating & Featured Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            <span>Rating Score (⭐ 1.0 - 5.0)</span>
          </label>
          <Input
            type="number"
            step="0.1"
            min="1.0"
            max="5.0"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="h-11 rounded-xl text-sm"
          />
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-3 rounded-xl border border-border/80 bg-secondary/40 p-3 cursor-pointer hover:bg-secondary/60 transition-colors">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-5 w-5 rounded border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Featured Resource
              </span>
              <p className="text-[11px] text-muted-foreground">
                Display with prominent "Featured" badge on homepage
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

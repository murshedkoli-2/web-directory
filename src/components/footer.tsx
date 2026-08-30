"use client"

import React from 'react'

interface FooterProps {
  onSelectCategory: (cat: string) => void
  onSelectPricing: (pricing: string) => void
  onSortChange: (sort: string) => void
}

export function Footer({ onSelectCategory, onSelectPricing, onSortChange }: FooterProps) {
  return (
    <footer className="border-t border-border/60 bg-secondary/20 pt-12 pb-8 text-muted-foreground text-xs sm:text-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 mb-12">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 overflow-hidden items-center justify-center rounded-lg border border-indigo-500/30 bg-card shadow-md">
                <img
                  src="/logo.png"
                  alt="WebNexus Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-base font-bold text-foreground">
                Web<span className="text-indigo-400">Nexus</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              The premier categorized website and tools directory for developers, creators, and product teams. Built with Next.js, PostgreSQL, Prisma, and shadcn/ui.
            </p>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('ai-ml')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  AI & Machine Learning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('dev-tools')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Developer Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('design-ui')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Design & UI/UX
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('productivity')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Productivity & Workflow
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Filters */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Quick Filters
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectPricing('free')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Free Tools & Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPricing('open_source')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Open Source Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSortChange('popular')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Most Popular
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSortChange('rating')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Highest Rated
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Tech Stack */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Tech Stack & Admin
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-foreground font-medium">⚡ Next.js (React 19)</li>
              <li className="text-foreground font-medium">🐘 Neon PostgreSQL</li>
              <li className="text-foreground font-medium">💎 Prisma ORM</li>
              <li>
                <a href="/admin" className="text-indigo-400 font-semibold hover:underline flex items-center gap-1 mt-1">
                  🛡️ Admin Management Portal →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40 text-xs text-muted-foreground">
          <p>© 2026 WebNexus Directory. All rights reserved.</p>
          <p>Curated for designers, engineers, and founders.</p>
        </div>
      </div>
    </footer>
  )
}

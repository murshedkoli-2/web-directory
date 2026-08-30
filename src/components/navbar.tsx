"use client"

import React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Bookmark, Plus, Sparkles, ShieldCheck } from 'lucide-react'

interface NavbarProps {
  bookmarksCount: number
  showBookmarksOnly: boolean
  onToggleBookmarks: () => void
  onOpenSubmit: () => void
}

export function Navbar({
  bookmarksCount,
  showBookmarksOnly,
  onToggleBookmarks,
  onOpenSubmit,
}: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl transition-colors">
      <div className="container mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl border border-indigo-500/30 bg-card shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="WebNexus Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">
            Web<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Nexus</span>
          </span>
        </a>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bookmarks Toggle */}
          <Button
            variant={showBookmarksOnly ? "default" : "outline"}
            size="sm"
            onClick={onToggleBookmarks}
            className={`gap-1.5 rounded-xl h-10 px-3 ${showBookmarksOnly ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent" : ""}`}
            title="View saved bookmarks"
          >
            <Bookmark className={`h-4 w-4 ${showBookmarksOnly ? "fill-white" : "text-amber-400"}`} />
            <span className="font-semibold">{bookmarksCount}</span>
            <span className="hidden sm:inline text-xs font-normal">Saved</span>
          </Button>

          {/* Dark / Light Mode Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl h-10 w-10"
            title="Toggle dark/light theme"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600 transition-transform hover:-rotate-12" />
              )
            ) : (
              <span className="h-4 w-4 opacity-0" />
            )}
          </Button>

          {/* Admin Portal Link */}
          <a href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl h-10 px-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/50"
              title="Open Admin Panel"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">Admin</span>
            </Button>
          </a>

          {/* Submit Website CTA */}
          <Button
            variant="glow"
            size="sm"
            onClick={onOpenSubmit}
            className="gap-1.5 rounded-xl h-10 px-4 font-semibold text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Site</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

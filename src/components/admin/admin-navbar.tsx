"use client"

import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, ArrowLeft, Plus, ShieldCheck } from 'lucide-react'

interface AdminNavbarProps {
  onOpenAddModal: () => void
}

export function AdminNavbar({ onOpenAddModal }: AdminNavbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="container mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl border border-indigo-500/30 bg-card shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="WebNexus Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-lg font-black tracking-tight text-foreground hidden sm:inline">
              Web<span className="text-indigo-400">Nexus</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-border/80 mx-1 hidden sm:block" />

          <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Portal</span>
          </div>
        </div>

        {/* Actions Group */}
        <div className="flex items-center gap-2.5">
          {/* Back to Public Directory */}
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl h-10 text-xs sm:text-sm">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">View Website</span>
            </Button>
          </Link>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl h-10 w-10"
            title="Toggle theme"
          >
            {mounted ? (
              theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )
            ) : (
              <span className="h-4 w-4 opacity-0" />
            )}
          </Button>

          {/* Add Website CTA */}
          <Button
            variant="glow"
            size="sm"
            onClick={onOpenAddModal}
            className="gap-1.5 rounded-xl h-10 px-4 font-semibold text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Website</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

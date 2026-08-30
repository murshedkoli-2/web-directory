"use client"

import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  Globe,
  Layers,
  Tags,
  Database,
  ExternalLink,
  Sun,
  Moon,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type AdminViewType = 'dashboard' | 'websites' | 'categories' | 'tags' | 'database'

interface AdminSidebarProps {
  activeView: AdminViewType
  onSelectView: (view: AdminViewType) => void
  websiteCount: number
  categoryCount: number
  tagCount: number
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function AdminSidebar({
  activeView,
  onSelectView,
  websiteCount,
  categoryCount,
  tagCount,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    {
      id: 'dashboard' as AdminViewType,
      label: 'Dashboard & Overview',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: 'websites' as AdminViewType,
      label: 'Websites Catalog',
      icon: <Globe className="h-4 w-4" />,
      badge: websiteCount,
    },
    {
      id: 'categories' as AdminViewType,
      label: 'Categories Manager',
      icon: <Layers className="h-4 w-4" />,
      badge: categoryCount,
    },
    {
      id: 'tags' as AdminViewType,
      label: 'Tags & Taxonomy',
      icon: <Tags className="h-4 w-4" />,
      badge: tagCount,
    },
    {
      id: 'database' as AdminViewType,
      label: 'Neon Database Health',
      icon: <Database className="h-4 w-4" />,
      statusDot: true,
    },
  ]

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-border/70 bg-card/95 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="flex h-18 items-center justify-between border-b border-border/60 px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl border border-indigo-500/30 bg-card shadow-lg shadow-indigo-500/25">
              <img
                src="/logo.png"
                alt="WebNexus Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-foreground">
                  WebNexus
                </span>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 font-mono text-[10px] font-bold text-indigo-400">
                  PRO
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-indigo-400" />
                <span>Admin Console</span>
              </div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id)
                  onCloseMobile()
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all select-none cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-bold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-indigo-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.statusDot && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Database Health Pill */}
        <div className="px-3.5 py-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Neon PostgreSQL Live</span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate font-mono">
              ep-ancient-cell-...neon.tech
            </p>
          </div>
        </div>

        {/* Sidebar Bottom Footer */}
        <div className="border-t border-border/60 p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/80 bg-secondary/60 py-2 text-xs font-semibold text-foreground hover:bg-secondary hover:text-indigo-400 transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 rounded-xl"
              title="Toggle Theme"
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
          </div>
        </div>
      </aside>
    </>
  )
}

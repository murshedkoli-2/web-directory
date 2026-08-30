"use client"

import React from 'react'
import Link from 'next/link'
import { Menu, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminViewType } from './admin-sidebar'

interface AdminHeaderProps {
  activeView: AdminViewType
  onOpenMobileMenu: () => void
}

export function AdminHeader({
  activeView,
  onOpenMobileMenu,
}: AdminHeaderProps) {
  const getBreadcrumbTitle = (view: AdminViewType) => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard & Metrics'
      case 'websites':
        return 'Websites Catalog'
      case 'categories':
        return 'Categories Manager'
      case 'tags':
        return 'Tags & Taxonomy'
      case 'database':
        return 'Neon Database Health'
      default:
        return 'Dashboard'
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-border/70 bg-background/80 px-4 sm:px-8 backdrop-blur-xl transition-colors">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <span className="text-muted-foreground hidden sm:inline">Admin Console</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 hidden sm:inline" />
          <span className="font-bold text-foreground bg-secondary/80 border border-border/60 px-2.5 py-1 rounded-lg">
            {getBreadcrumbTitle(activeView)}
          </span>
        </div>
      </div>

      {/* Right: Add Website CTA routing to multi-step wizard */}
      <div className="flex items-center gap-3">
        <Link href="/admin/websites/new">
          <Button
            variant="glow"
            size="sm"
            className="gap-2 rounded-xl h-10 px-4 font-bold text-xs sm:text-sm shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Add Website</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}

"use client"

import React from 'react'
import Link from 'next/link'
import { Category, Website } from '@/types'
import { AdminTable } from '../admin-table'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'

interface WebsitesViewProps {
  websites: Website[]
  categories: Category[]
  onEditWebsite: (website: Website) => void
  onDeleteWebsite: (website: Website) => void
  onRefresh: () => void
}

export function WebsitesView({
  websites,
  categories,
  onEditWebsite,
  onDeleteWebsite,
  onRefresh,
}: WebsitesViewProps) {
  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      source: 'Neon PostgreSQL (WebNexus)',
      count: websites.length,
      websites,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `webnexus-catalog-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Websites Catalog
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage, verify, edit, and organize all website directory listings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            className="gap-1.5 rounded-xl h-10 text-xs"
          >
            <Download className="h-4 w-4" />
            <span>Export JSON</span>
          </Button>

          <Link href="/admin/websites/new">
            <Button
              variant="glow"
              size="sm"
              className="gap-1.5 rounded-xl h-10 font-bold text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Website</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Admin Data Grid */}
      <AdminTable
        websites={websites}
        categories={categories}
        onEditWebsite={onEditWebsite}
        onDeleteWebsite={onDeleteWebsite}
        onRefresh={onRefresh}
      />
    </div>
  )
}

"use client"

import React, { useState, useEffect, useTransition } from 'react'
import { Category, Website } from '@/types'
import { getAdminDashboardData, AdminDashboardData } from '@/app/actions/admin-actions'
import { AdminSidebar, AdminViewType } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { DashboardView } from '@/components/admin/views/dashboard-view'
import { WebsitesView } from '@/components/admin/views/websites-view'
import { CategoriesView } from '@/components/admin/views/categories-view'
import { TagsView } from '@/components/admin/views/tags-view'
import { DatabaseView } from '@/components/admin/views/database-view'
import { WebsiteFormDialog } from '@/components/admin/website-form-dialog'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<AdminViewType>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Dialog States
  const [formOpen, setFormOpen] = useState(false)
  const [websiteToEdit, setWebsiteToEdit] = useState<Website | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [websiteToDelete, setWebsiteToDelete] = useState<Website | null>(null)

  const loadData = () => {
    startTransition(async () => {
      try {
        const dashboardData = await getAdminDashboardData()
        setData(dashboardData)
      } catch (err) {
        console.error('Failed to load admin dashboard data:', err)
      } finally {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setWebsiteToEdit(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (website: Website) => {
    setWebsiteToEdit(website)
    setFormOpen(true)
  }

  const handleOpenDelete = (website: Website) => {
    setWebsiteToDelete(website)
    setDeleteOpen(true)
  }

  // Drilldown category filter from CategoriesView
  const handleSelectCategoryFilter = (categorySlug: string) => {
    setActiveView('websites')
  }

  // Drilldown tag filter from TagsView
  const handleSelectTagFilter = (tagName: string) => {
    setActiveView('websites')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeView={activeView}
        onSelectView={setActiveView}
        websiteCount={data?.stats.totalWebsites || 0}
        categoryCount={data?.stats.totalCategories || 0}
        tagCount={data?.stats.totalTags || 0}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="flex flex-1 flex-col lg:pl-72 min-w-0">
        {/* Top Header Bar */}
        <AdminHeader
          activeView={activeView}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* View Outlet Container */}
        <main className="flex-1 p-4 sm:p-8">
          {loading || !data ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-xs text-muted-foreground">Connecting to Neon PostgreSQL...</p>
              </div>
            </div>
          ) : (
            <>
              {activeView === 'dashboard' && (
                <DashboardView
                  stats={data.stats}
                  websites={data.websites}
                  categories={data.categories}
                  onSelectView={setActiveView}
                  onEditWebsite={handleOpenEdit}
                />
              )}

              {activeView === 'websites' && (
                <WebsitesView
                  websites={data.websites}
                  categories={data.categories}
                  onEditWebsite={handleOpenEdit}
                  onDeleteWebsite={handleOpenDelete}
                  onRefresh={loadData}
                />
              )}

              {activeView === 'categories' && (
                <CategoriesView
                  categories={data.categories}
                  websites={data.websites}
                  onSelectCategoryFilter={handleSelectCategoryFilter}
                />
              )}

              {activeView === 'tags' && (
                <TagsView
                  websites={data.websites}
                  onSelectTagFilter={handleSelectTagFilter}
                />
              )}

              {activeView === 'database' && (
                <DatabaseView stats={data.stats} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Add / Edit Form Modal */}
      {data && (
        <WebsiteFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          websiteToEdit={websiteToEdit}
          categories={data.categories}
          onSuccess={loadData}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        website={websiteToDelete}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={loadData}
      />
    </div>
  )
}

"use client"

import React, { useState, useEffect, useTransition, useMemo } from 'react'
import { Category, Website } from '@/types'
import { getCategories, getWebsites, upvoteWebsite } from '@/app/actions/website-actions'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { CategoryNav } from '@/components/category-nav'
import { FilterToolbar } from '@/components/filter-toolbar'
import { WebsiteGrid } from '@/components/website-grid'
import { WebsiteDetailDialog } from '@/components/website-detail-dialog'
import { SubmitWebsiteDialog } from '@/components/submit-website-dialog'
import { Footer } from '@/components/footer'
import { toast } from 'sonner'

export default function DirectoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [allWebsites, setAllWebsites] = useState<Website[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedPricing, setSelectedPricing] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('popular')
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false)

  // Local Storage Bookmarks and Upvotes
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [upvotedIds, setUpvotedIds] = useState<string[]>([])

  // Modals state
  const [selectedDetailWebsite, setSelectedDetailWebsite] = useState<Website | null>(null)
  const [submitDialogOpen, setSubmitDialogOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  // Load initial data and localStorage on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('webnexus_bookmarks')
      if (savedBookmarks) setBookmarkedIds(JSON.parse(savedBookmarks))

      const savedUpvotes = localStorage.getItem('webnexus_upvoted_ids')
      if (savedUpvotes) setUpvotedIds(JSON.parse(savedUpvotes))
    } catch (e) {
      console.error('Error loading bookmarks or upvotes from localStorage:', e)
    }

    // Fetch categories and websites from server
    refreshData()
  }, [])

  const refreshData = async () => {
    startTransition(async () => {
      try {
        const [cats, sites] = await Promise.all([
          getCategories(),
          getWebsites(),
        ])
        setCategories(cats)
        setAllWebsites(sites)
      } catch (err) {
        console.error('Failed to fetch directory data:', err)
      }
    })
  }

  // Toggle Bookmark
  const handleToggleBookmark = (siteId: string) => {
    let updated: string[] = []
    const isSaved = bookmarkedIds.includes(siteId)

    if (isSaved) {
      updated = bookmarkedIds.filter((id) => id !== siteId)
      toast.info('Removed from saved bookmarks')
    } else {
      updated = [...bookmarkedIds, siteId]
      toast.success('Saved website to your bookmarks!')
    }

    setBookmarkedIds(updated)
    try {
      localStorage.setItem('webnexus_bookmarks', JSON.stringify(updated))
    } catch (e) {
      console.error('Error saving bookmarks:', e)
    }
  }

  // Toggle Upvote
  const handleToggleUpvote = async (siteId: string) => {
    const isUpvoted = upvotedIds.includes(siteId)
    let updated: string[] = []

    if (isUpvoted) {
      updated = upvotedIds.filter((id) => id !== siteId)
      setUpvotedIds(updated)
      setAllWebsites((prev) =>
        prev.map((s) => (s.id === siteId ? { ...s, upvotes: Math.max(0, s.upvotes - 1) } : s))
      )
      toast.info('Removed upvote')
    } else {
      updated = [...upvotedIds, siteId]
      setUpvotedIds(updated)
      setAllWebsites((prev) =>
        prev.map((s) => (s.id === siteId ? { ...s, upvotes: s.upvotes + 1 } : s))
      )
      toast.success('Upvoted!')
      await upvoteWebsite(siteId)
    }

    try {
      localStorage.setItem('webnexus_upvoted_ids', JSON.stringify(updated))
    } catch (e) {
      console.error('Error saving upvotes:', e)
    }
  }

  // Multi-dimensional filtering pipeline
  const filteredWebsites = useMemo(() => {
    let list = [...allWebsites]

    // 1. Bookmarks Only
    if (showBookmarksOnly) {
      list = list.filter((s) => bookmarkedIds.includes(s.id))
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter(
        (s) => s.categoryId === `cat-${selectedCategory}` || s.category?.slug === selectedCategory
      )
    }

    // 3. Pricing Filter
    if (selectedPricing !== 'all') {
      list = list.filter((s) => s.pricing.toLowerCase() === selectedPricing.toLowerCase())
    }

    // 4. Tag Filter
    if (selectedTag) {
      list = list.filter((s) =>
        s.tags.some((t) => (typeof t === 'string' ? t : t.name).toLowerCase() === selectedTag.toLowerCase())
      )
    }

    // 5. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.domain.toLowerCase().includes(q) ||
          s.tags.some((t) => (typeof t === 'string' ? t : t.name).toLowerCase().includes(q))
      )
    }

    // 6. Sorting
    list.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return (b.upvotes || 0) - (a.upvotes || 0)
    })

    return list
  }, [allWebsites, showBookmarksOnly, bookmarkedIds, selectedCategory, selectedPricing, selectedTag, searchQuery, sortBy])

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSelectedPricing('all')
    setSelectedTag(null)
    setShowBookmarksOnly(false)
  }

  return (
    <>
      {/* Sticky Header Navbar */}
      <Navbar
        bookmarksCount={bookmarkedIds.length}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarks={() => setShowBookmarksOnly((prev) => !prev)}
        onOpenSubmit={() => setSubmitDialogOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalWebsites={allWebsites.length}
        totalCategories={categories.length}
        totalBookmarks={bookmarkedIds.length}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          {/* Category Navigation Bar */}
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(slug) => {
              setSelectedCategory(slug)
              setShowBookmarksOnly(false)
            }}
            totalCount={allWebsites.length}
          />

          {/* Filter & Sort Controls */}
          <FilterToolbar
            selectedPricing={selectedPricing}
            onSelectPricing={setSelectedPricing}
            selectedTag={selectedTag}
            onClearTag={() => setSelectedTag(null)}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultsCount={filteredWebsites.length}
          />

          {/* Cards Grid */}
          <WebsiteGrid
            websites={filteredWebsites}
            bookmarkedIds={bookmarkedIds}
            upvotedIds={upvotedIds}
            onSelectWebsite={(site) => setSelectedDetailWebsite(site)}
            onToggleBookmark={handleToggleBookmark}
            onToggleUpvote={handleToggleUpvote}
            onFilterTag={(tag) => setSelectedTag(tag)}
            onResetFilters={handleResetFilters}
          />
        </div>
      </main>

      {/* Website Details Modal */}
      <WebsiteDetailDialog
        website={selectedDetailWebsite}
        open={Boolean(selectedDetailWebsite)}
        onOpenChange={(open) => {
          if (!open) setSelectedDetailWebsite(null)
        }}
        isBookmarked={Boolean(selectedDetailWebsite && bookmarkedIds.includes(selectedDetailWebsite.id))}
        isUpvoted={Boolean(selectedDetailWebsite && upvotedIds.includes(selectedDetailWebsite.id))}
        onToggleBookmark={handleToggleBookmark}
        onToggleUpvote={handleToggleUpvote}
        onFilterTag={(tag) => {
          setSelectedTag(tag)
          setSelectedDetailWebsite(null)
        }}
      />

      {/* Community Submit Website Modal */}
      <SubmitWebsiteDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        categories={categories}
        onSuccess={(newCatSlug) => {
          refreshData()
          if (newCatSlug) setSelectedCategory(newCatSlug)
        }}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(slug) => {
          setSelectedCategory(slug)
          window.scrollTo({ top: 400, behavior: 'smooth' })
        }}
        onSelectPricing={(pricing) => {
          setSelectedPricing(pricing)
          window.scrollTo({ top: 400, behavior: 'smooth' })
        }}
        onSortChange={(sort) => {
          setSortBy(sort)
          window.scrollTo({ top: 400, behavior: 'smooth' })
        }}
      />
    </>
  )
}

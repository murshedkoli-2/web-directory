"use client"

import React, { useState, useEffect } from 'react'
import { Category, PricingType, Website } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Sparkles } from 'lucide-react'
import { createAdminWebsite, updateAdminWebsite, AdminWebsiteInput } from '@/app/actions/admin-actions'

interface WebsiteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  websiteToEdit: Website | null
  categories: Category[]
  onSuccess: () => void
}

export function WebsiteFormDialog({
  open,
  onOpenChange,
  websiteToEdit,
  categories,
  onSuccess,
}: WebsiteFormDialogProps) {
  const isEdit = Boolean(websiteToEdit)
  const [loading, setLoading] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [pricing, setPricing] = useState<PricingType>('FREEMIUM')
  const [rating, setRating] = useState('4.9')
  const [featured, setFeatured] = useState(false)
  const [iconBg, setIconBg] = useState('#6366f1')
  const [iconText, setIconText] = useState('')
  const [description, setDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [tags, setTags] = useState('')
  const [features, setFeatures] = useState('')

  // Sync state when editing
  useEffect(() => {
    if (websiteToEdit) {
      setName(websiteToEdit.name)
      setUrl(websiteToEdit.url)
      setCategoryId(websiteToEdit.categoryId)
      setPricing(websiteToEdit.pricing)
      setRating(String(websiteToEdit.rating || 5.0))
      setFeatured(websiteToEdit.featured || false)
      setIconBg(websiteToEdit.iconBg || '#6366f1')
      setIconText(websiteToEdit.iconText || '')
      setDescription(websiteToEdit.description)
      setLongDescription(websiteToEdit.longDescription || '')
      setTags(
        websiteToEdit.tags
          .map((t) => (typeof t === 'string' ? t : t.name))
          .join(', ')
      )
      setFeatures((websiteToEdit.keyFeatures || []).join('\n'))
    } else {
      // Defaults for new entry
      setName('')
      setUrl('')
      setCategoryId(categories[0]?.id || '')
      setPricing('FREEMIUM')
      setRating('4.9')
      setFeatured(false)
      setIconBg('#6366f1')
      setIconText('')
      setDescription('')
      setLongDescription('')
      setTags('')
      setFeatures('')
    }
  }, [websiteToEdit, categories, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !url.trim() || !description.trim() || !categoryId) {
      toast.error('Please fill in all required fields.')
      return
    }

    setLoading(true)

    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const featureArray = features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    const inputData: AdminWebsiteInput = {
      name: name.trim(),
      url: url.trim(),
      categoryId,
      pricing,
      rating: parseFloat(rating) || 5.0,
      featured,
      iconBg,
      iconText: iconText.trim() || name.trim().slice(0, 2).toUpperCase(),
      description: description.trim(),
      longDescription: longDescription.trim() || description.trim(),
      tags: tagArray,
      keyFeatures: featureArray,
    }

    try {
      let res
      if (isEdit && websiteToEdit) {
        res = await updateAdminWebsite(websiteToEdit.id, inputData)
        if (res.success) {
          toast.success(`Updated "${res.website?.name}" in database!`)
        }
      } else {
        res = await createAdminWebsite(inputData)
        if (res.success) {
          toast.success(`Added "${res.website?.name}" to Neon database!`)
        }
      }

      if (res.success) {
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(res.error || 'Failed to save website.')
      }
    } catch {
      toast.error('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border/80 bg-card/95 backdrop-blur-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold text-foreground">
            {isEdit ? `Edit "${websiteToEdit?.name}"` : 'Add New Website to Directory'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEdit
              ? 'Update website details, category, tags, and features in Neon PostgreSQL.'
              : 'Add a new verified resource directly into your Neon PostgreSQL database.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Name & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Website Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Linear"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Website URL *
              </label>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://linear.app"
                required
              />
            </div>
          </div>

          {/* Row 2: Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Category *
              </label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Pricing Model *
              </label>
              <Select value={pricing} onValueChange={(v) => setPricing(v as PricingType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Pricing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="FREEMIUM">Freemium</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="OPEN_SOURCE">Open Source</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Rating, Featured, Icon Color, Icon Text */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Rating (1-5)
              </label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Icon Text / Initials
              </label>
              <Input
                value={iconText}
                onChange={(e) => setIconText(e.target.value)}
                placeholder="e.g. LN"
                maxLength={4}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Icon Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={iconBg}
                  onChange={(e) => setIconBg(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-border bg-transparent p-1"
                />
                <Input
                  value={iconBg}
                  onChange={(e) => setIconBg(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/40 p-2.5 cursor-pointer hover:bg-secondary/60 transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Featured
                </span>
              </label>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Short Description *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One-to-two sentence overview shown on the card..."
              rows={2}
              required
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Detailed Long Description
            </label>
            <Textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="In-depth explanation displayed in the details dialog..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Tags (comma separated)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. React, Productivity, Issue Tracking, Agile"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Separate multiple tags with commas.
            </p>
          </div>

          {/* Key Highlights */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Key Highlights / Features (1 per line)
            </label>
            <Textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Sub-50ms sync speed&#10;Keyboard shortcuts for everything&#10;GitHub 2-way sync"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glow"
              disabled={loading}
              className="gap-2 rounded-xl"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isEdit ? 'Save Changes' : 'Create Website'}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

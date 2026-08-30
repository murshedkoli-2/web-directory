"use client"

import React, { useState } from 'react'
import { Category, PricingType, SubmitWebsiteInput } from '@/types'
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
import { PlusCircle, Loader2 } from 'lucide-react'
import { submitWebsite } from '@/app/actions/website-actions'

interface SubmitWebsiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onSuccess: (newCategorySlug?: string) => void
}

export function SubmitWebsiteDialog({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: SubmitWebsiteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-ai-ml')
  const [pricing, setPricing] = useState<PricingType>('FREEMIUM')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [features, setFeatures] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !url.trim() || !description.trim()) {
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

    const input: SubmitWebsiteInput = {
      name: name.trim(),
      url: url.trim(),
      categoryId,
      pricing,
      description: description.trim(),
      tags: tagArray,
      keyFeatures: featureArray,
    }

    try {
      const res = await submitWebsite(input)
      if (res.success && res.website) {
        toast.success(`Successfully submitted "${res.website.name}"!`)
        // Reset form
        setName('')
        setUrl('')
        setDescription('')
        setTags('')
        setFeatures('')
        onOpenChange(false)

        const catObj = categories.find((c) => c.id === categoryId)
        onSuccess(catObj?.slug)
      } else {
        toast.error(res.error || 'Failed to submit website.')
      }
    } catch {
      toast.error('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-border/80 bg-card/95 backdrop-blur-2xl p-6">
        <DialogHeader className="mb-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <PlusCircle className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold">Submit a New Website</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Suggest a great developer tool, AI model, or design resource to include in the WebNexus directory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Website Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Supabase"
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
                placeholder="https://example.com"
                required
              />
            </div>
          </div>

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

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Short Description *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this tool or website provides..."
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Tags (comma separated)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. React, Database, BaaS, Postgres"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Separate multiple tags with commas.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Key Highlights / Features (1 per line)
            </label>
            <Textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Real-time subscriptions&#10;Built-in Auth&#10;Postgres SQL database"
              rows={3}
            />
          </div>

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
              <span>{loading ? 'Submitting...' : 'Submit Website'}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

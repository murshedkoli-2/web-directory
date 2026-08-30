"use client"

import React, { useState } from 'react'
import { Website } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteAdminWebsite } from '@/app/actions/admin-actions'

interface DeleteConfirmDialogProps {
  website: Website | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteConfirmDialog({
  website,
  open,
  onOpenChange,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  if (!website) return null

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await deleteAdminWebsite(website.id)
      if (res.success) {
        toast.success(`Deleted "${website.name}" from Neon database!`)
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(res.error || 'Failed to delete website.')
      }
    } catch {
      toast.error('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-destructive/40 bg-card/95 backdrop-blur-2xl p-6">
        <DialogHeader className="mb-2">
          <div className="flex items-center gap-2.5 text-red-500 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Delete Website
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-2">
            Are you sure you want to permanently delete{' '}
            <strong className="text-foreground font-semibold">"{website.name}"</strong> (
            <span className="font-mono text-muted-foreground">{website.domain}</span>) from the
            Neon PostgreSQL database? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
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
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="gap-2 rounded-xl"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Delete Permanently</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

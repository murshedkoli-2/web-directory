"use client"

import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { FileText, AlignLeft, Sparkles } from 'lucide-react'

interface Step2ContentProps {
  description: string
  setDescription: (v: string) => void
  longDescription: string
  setLongDescription: (v: string) => void
}

export function Step2Content({
  description,
  setDescription,
  longDescription,
  setLongDescription,
}: Step2ContentProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-bold text-foreground">Step 2: Content & Copy</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Write clear, engaging descriptions for the website listing.
        </p>
      </div>

      {/* Short Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <AlignLeft className="h-3.5 w-3.5 text-indigo-400" />
            <span>Short Card Description * (1-2 sentences)</span>
          </label>
          <span className="font-mono text-[11px] text-muted-foreground">
            {description.length} chars
          </span>
        </div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Leading open source Firebase alternative providing PostgreSQL databases, Auth, Storage, and Realtime APIs."
          className="min-h-[90px] rounded-xl text-sm"
          required
        />
        <p className="text-[11px] text-muted-foreground mt-1.5">
          This summary appears on directory cards and in search results.
        </p>
      </div>

      {/* Detailed Long Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <FileText className="h-3.5 w-3.5 text-purple-400" />
            <span>Detailed Long Overview (Shown in Modal / Deep View)</span>
          </label>
          <span className="font-mono text-[11px] text-muted-foreground">
            {longDescription.length} chars
          </span>
        </div>
        <Textarea
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          placeholder="e.g. Supabase gives you a full Postgres database for every project with automatic REST and GraphQL APIs, row-level security, vector embeddings (pgvector), and Edge Functions."
          className="min-h-[140px] rounded-xl text-sm"
        />
        <p className="text-[11px] text-muted-foreground mt-1.5">
          If left blank, the short description will be used automatically.
        </p>
      </div>
    </div>
  )
}

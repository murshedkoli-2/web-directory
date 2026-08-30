"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tags, Plus, X, Check, Sparkles, Trash2 } from 'lucide-react'

interface Step3FeaturesProps {
  tags: string[]
  setTags: (v: string[]) => void
  keyFeatures: string[]
  setKeyFeatures: (v: string[]) => void
}

export function Step3Features({
  tags,
  setTags,
  keyFeatures,
  setKeyFeatures,
}: Step3FeaturesProps) {
  const [tagInput, setTagInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')

  const suggestedTags = [
    'React',
    'PostgreSQL',
    'Tailwind',
    'Generative AI',
    'Open Source',
    'Next.js',
    'Productivity',
    'Design System',
    'Cloud',
    'Database',
    'TypeScript',
    'No-Code',
    'API',
    'Automation',
  ]

  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '')
    if (clean && !tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setTags([...tags, clean])
    }
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setKeyFeatures([...keyFeatures, featureInput.trim()])
      setFeatureInput('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-bold text-foreground">Step 3: Tags & Key Highlights</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Add searchable topic tags and bulleted feature highlights.
        </p>
      </div>

      {/* Relational Tags Builder */}
      <div className="space-y-3">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Tags className="h-3.5 w-3.5 text-indigo-400" />
          <span>Relational Tags ({tags.length} added)</span>
        </label>

        {/* Input Field with Add Button */}
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                handleAddTag(tagInput)
              }
            }}
            placeholder="Type a tag and press Enter (e.g. Next.js, Cloud, Auth)..."
            className="h-11 rounded-xl text-sm"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleAddTag(tagInput)}
            className="h-11 px-4 rounded-xl gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>

        {/* Active Tag Chips */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300 shadow-sm"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="rounded-full hover:bg-indigo-500/30 p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Quick Suggested Tags */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
            Popular Suggestions (Click to Add):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedTags.map((tag) => {
              const isAlreadyAdded = tags.some((t) => t.toLowerCase() === tag.toLowerCase())
              return (
                <button
                  key={tag}
                  type="button"
                  disabled={isAlreadyAdded}
                  onClick={() => handleAddTag(tag)}
                  className={`rounded-lg border px-2.5 py-1 text-xs transition-all cursor-pointer ${
                    isAlreadyAdded
                      ? 'border-border/40 bg-secondary/30 text-muted-foreground opacity-50 cursor-not-allowed'
                      : 'border-border/70 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-border'
                  }`}
                >
                  +{tag}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Key Features Builder */}
      <div className="space-y-3 pt-2 border-t border-border/50">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Key Feature Highlights ({keyFeatures.length} added)</span>
        </label>

        {/* Add Feature Input */}
        <div className="flex gap-2">
          <Input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddFeature()
              }
            }}
            placeholder="e.g. Dedicated Postgres database for every project"
            className="h-11 rounded-xl text-sm"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddFeature}
            className="h-11 px-4 rounded-xl gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Add Highlight</span>
          </Button>
        </div>

        {/* List of Key Highlights */}
        {keyFeatures.length > 0 && (
          <div className="space-y-2 pt-1">
            {keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-secondary/40 text-xs"
              >
                <div className="flex items-center gap-2.5 text-foreground font-medium">
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-muted-foreground hover:text-red-400 p-1 transition-colors"
                  title="Remove highlight"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Globe, Layers, Tags, ThumbsUp, Sparkles } from 'lucide-react'

interface AdminStatsProps {
  stats: {
    totalWebsites: number
    totalCategories: number
    totalTags: number
    totalUpvotes: number
    featuredCount: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      label: 'Total Websites',
      value: stats.totalWebsites,
      icon: <Globe className="h-5 w-5 text-indigo-400" />,
      color: 'from-indigo-500/20 to-indigo-500/5',
      border: 'border-indigo-500/30',
    },
    {
      label: 'Categories',
      value: stats.totalCategories,
      icon: <Layers className="h-5 w-5 text-purple-400" />,
      color: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/30',
    },
    {
      label: 'Unique Tags',
      value: stats.totalTags,
      icon: <Tags className="h-5 w-5 text-pink-400" />,
      color: 'from-pink-500/20 to-pink-500/5',
      border: 'border-pink-500/30',
    },
    {
      label: 'Community Upvotes',
      value: stats.totalUpvotes,
      icon: <ThumbsUp className="h-5 w-5 text-amber-400" />,
      color: 'from-amber-500/20 to-amber-500/5',
      border: 'border-amber-500/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
      {statCards.map((card, index) => (
        <Card
          key={index}
          className={`border ${card.border} bg-gradient-to-br ${card.color} backdrop-blur-xl`}
        >
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </p>
              <h3 className="mt-1 text-2xl font-extrabold font-mono text-foreground">
                {card.value}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-card/80 border border-border/60 shadow-sm">
              {card.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import React from 'react'
import { motion, useScroll, useTransform, useSpring, MotionConfig } from 'framer-motion'
import { Search, Sparkles, X, Globe, Layers, Bookmark } from 'lucide-react'

interface HeroSectionProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  totalWebsites: number
  totalCategories: number
  totalBookmarks: number
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  totalWebsites,
  totalCategories,
  totalBookmarks,
}: HeroSectionProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const sectionRef = React.useRef<HTMLElement>(null)

  // Keyboard shortcut listener (/ or Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && document.activeElement !== searchInputRef.current && !e.ctrlKey && !e.metaKey) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Scroll-driven 3D camera dive: as the page scrolls past the hero,
  // background orbs recede in depth (scale/blur) while content tilts back.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const rawTiltX = useTransform(scrollYProgress, [0, 1], [0, -18])
  const tiltX = useSpring(rawTiltX, { stiffness: 120, damping: 20, mass: 0.5 })
  const rawContentY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const contentY = useSpring(rawContentY, { stiffness: 120, damping: 20 })
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  const orbBackZ = useTransform(scrollYProgress, [0, 1], [0, -400])
  const orbBackScale = useTransform(scrollYProgress, [0, 1], [1, 0.6])
  const orbFrontZ = useTransform(scrollYProgress, [0, 1], [0, -200])
  const orbFrontScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  // Pointer-driven parallax tilt for the search card
  const [pointer, setPointer] = React.useState({ x: 0, y: 0 })
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setPointer({ x, y })
  }
  const handlePointerLeave = () => setPointer({ x: 0, y: 0 })

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className="relative pt-12 pb-8 text-center sm:pt-16 sm:pb-10 overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        {/* Depth-layered ambient orbs — recede into the screen on scroll */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-[130%] rounded-full bg-indigo-500/25 blur-3xl"
          style={{ z: orbBackZ, scale: orbBackScale, transformStyle: 'preserve-3d' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/2 h-80 w-80 translate-x-[40%] rounded-full bg-purple-500/20 blur-3xl"
          style={{ z: orbFrontZ, scale: orbFrontScale, transformStyle: 'preserve-3d' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-20 left-1/2 h-56 w-56 -translate-x-[20%] rounded-full bg-pink-500/15 blur-3xl"
          style={{ z: orbBackZ, scale: orbFrontScale, transformStyle: 'preserve-3d' }}
        />

        <motion.div
          className="container relative mx-auto max-w-5xl px-4 sm:px-6"
          style={{
            rotateX: tiltX,
            y: contentY,
            opacity: contentOpacity,
            scale: contentScale,
            transformStyle: 'preserve-3d',
            transformPerspective: 1200,
          }}
        >
          {/* Glowing Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16, rotateX: -40 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-6 shadow-sm shadow-indigo-500/10 animate-pulse"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Curated Next.js Directory with PostgreSQL & Prisma</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40, rotateX: -30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.12] mb-4"
          >
            Discover the Finest <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Websites & Tools
            </span>{' '}
            by Category
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-8"
          >
            Explore 40+ hand-picked AI assistants, developer utilities, UI/UX design inspirations, productivity suites, and open-source gems.
          </motion.p>

          {/* Hero Live Search Input — tilts in 3D toward the pointer */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
            className="mx-auto max-w-2xl mb-8"
            style={{ perspective: 800 }}
          >
            <motion.div
              animate={{
                rotateX: pointer.y * -8,
                rotateY: pointer.x * 8,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative flex items-center rounded-2xl border border-border/80 bg-card/70 p-2 shadow-2xl backdrop-blur-2xl transition-colors focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/15"
            >
              <Search className="ml-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name, description, domain, or tag (e.g. OpenAI, React, SEO)..."
                className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none"
                spellCheck={false}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="mr-2 p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-secondary/80 px-2 font-mono text-[11px] font-medium text-muted-foreground select-none">
                /
              </kbd>
            </motion.div>
          </motion.div>

          {/* Metrics Counter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6 sm:gap-12 rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-xl shadow-sm text-sm"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-indigo-400" />
              <span className="font-mono font-bold text-foreground text-base">{totalWebsites}</span>
              <span className="text-muted-foreground text-xs sm:text-sm">Curated Sites</span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-border/80" />

            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-purple-400" />
              <span className="font-mono font-bold text-foreground text-base">{totalCategories}</span>
              <span className="text-muted-foreground text-xs sm:text-sm">Categories</span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-border/80" />

            <div className="flex items-center gap-2.5">
              <Bookmark className="h-4 w-4 text-amber-400" />
              <span className="font-mono font-bold text-foreground text-base">{totalBookmarks}</span>
              <span className="text-muted-foreground text-xs sm:text-sm">Saved Favorites</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </MotionConfig>
  )
}

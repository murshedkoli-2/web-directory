"use client"

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Category, PricingType } from '@/types'
import { getCategories } from '@/app/actions/website-actions'
import { createAdminWebsite, AdminWebsiteInput } from '@/app/actions/admin-actions'
import { WizardStepper } from '@/components/admin/wizard/wizard-stepper'
import { Step1Basic } from '@/components/admin/wizard/step-1-basic'
import { Step2Content } from '@/components/admin/wizard/step-2-content'
import { Step3Features } from '@/components/admin/wizard/step-3-features'
import { Step4Branding } from '@/components/admin/wizard/step-4-branding'
import { Step5Review } from '@/components/admin/wizard/step-5-review'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Globe,
} from 'lucide-react'
import { toast } from 'sonner'

export default function NewWebsiteWizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Form State
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [pricing, setPricing] = useState<PricingType>('FREEMIUM')
  const [description, setDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [tags, setTags] = useState<string[]>(['Developer Tools', 'Web App'])
  const [keyFeatures, setKeyFeatures] = useState<string[]>([
    'Verified Web Resource',
    'Direct Online Access',
  ])
  const [iconText, setIconText] = useState('')
  const [iconBg, setIconBg] = useState('#6366f1')
  const [rating, setRating] = useState('4.9')
  const [featured, setFeatured] = useState(false)

  // Fetch categories on load
  useEffect(() => {
    startTransition(async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id)
        }
      } catch (err) {
        console.error('Failed to load categories:', err)
      } finally {
        setLoadingCats(false)
      }
    })
  }, [])

  // Validation before advancing
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        toast.error('Please enter the website or product name.')
        return
      }
      if (!url.trim()) {
        toast.error('Please enter a valid website URL.')
        return
      }
      if (!categoryId) {
        toast.error('Please select a category.')
        return
      }
    }

    if (currentStep === 2) {
      if (!description.trim()) {
        toast.error('Please write a short description.')
        return
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Final Publish Action
  const handlePublish = async () => {
    setSubmitting(true)
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
      tags,
      keyFeatures,
    }

    try {
      const res = await createAdminWebsite(inputData)
      if (res.success && res.website) {
        toast.success(`Successfully published "${res.website.name}" to Neon PostgreSQL!`)
        router.push('/admin')
      } else {
        toast.error(res.error || 'Failed to publish website.')
        setSubmitting(false)
      }
    } catch {
      toast.error('An unexpected error occurred.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500/20 selection:text-indigo-400">
      {/* Wizard Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 px-4 sm:px-8 py-4 backdrop-blur-xl transition-colors">
        <div className="container mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl h-9 text-xs">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Admin</span>
              </Button>
            </Link>

            <div className="h-4 w-px bg-border/80 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-extrabold text-white text-xs shadow-md">
                W
              </div>
              <span className="text-sm font-bold text-foreground">
                Add Website <span className="text-indigo-400">Wizard</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="hidden sm:inline">Step</span>
            <strong className="text-foreground">{currentStep}</strong> / 5
          </div>
        </div>
      </header>

      {/* Main Wizard Content */}
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
          {/* Stepper Progress Bar */}
          <WizardStepper
            currentStep={currentStep}
            onStepClick={(stepId) => setCurrentStep(stepId)}
          />

          {/* Form Step Body */}
          {loadingCats ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-xs text-muted-foreground">Loading directory taxonomy...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              {currentStep === 1 && (
                <Step1Basic
                  name={name}
                  setName={setName}
                  url={url}
                  setUrl={setUrl}
                  categoryId={categoryId}
                  setCategoryId={setCategoryId}
                  pricing={pricing}
                  setPricing={setPricing}
                  categories={categories}
                />
              )}

              {currentStep === 2 && (
                <Step2Content
                  description={description}
                  setDescription={setDescription}
                  longDescription={longDescription}
                  setLongDescription={setLongDescription}
                />
              )}

              {currentStep === 3 && (
                <Step3Features
                  tags={tags}
                  setTags={setTags}
                  keyFeatures={keyFeatures}
                  setKeyFeatures={setKeyFeatures}
                />
              )}

              {currentStep === 4 && (
                <Step4Branding
                  iconText={iconText}
                  setIconText={setIconText}
                  iconBg={iconBg}
                  setIconBg={setIconBg}
                  rating={rating}
                  setRating={setRating}
                  featured={featured}
                  setFeatured={setFeatured}
                  websiteName={name}
                />
              )}

              {currentStep === 5 && (
                <Step5Review
                  name={name}
                  url={url}
                  categoryId={categoryId}
                  pricing={pricing}
                  description={description}
                  longDescription={longDescription}
                  tags={tags}
                  keyFeatures={keyFeatures}
                  iconText={iconText}
                  iconBg={iconBg}
                  rating={rating}
                  featured={featured}
                  categories={categories}
                />
              )}

              {/* Step Action Buttons */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-border/60">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={submitting}
                    className="gap-2 rounded-xl h-11 px-5 text-xs sm:text-sm font-semibold"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous Step</span>
                  </Button>
                ) : (
                  <Link href="/admin">
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-xl h-11 px-4 text-xs text-muted-foreground"
                    >
                      Cancel & Exit
                    </Button>
                  </Link>
                )}

                {currentStep < 5 ? (
                  <Button
                    type="button"
                    variant="glow"
                    onClick={handleNextStep}
                    className="gap-2 rounded-xl h-11 px-6 text-xs sm:text-sm font-bold shadow-lg"
                  >
                    <span>Continue to Next Step</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="glow"
                    onClick={handlePublish}
                    disabled={submitting}
                    className="gap-2 rounded-xl h-12 px-8 text-sm font-black shadow-xl"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                    <span>{submitting ? 'Publishing to Neon...' : 'Publish Website to Directory'}</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

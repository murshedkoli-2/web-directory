"use client"

import React from 'react'
import { Check, Info, FileText, Tags, Palette, Eye } from 'lucide-react'

export interface StepItem {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

export const WIZARD_STEPS: StepItem[] = [
  {
    id: 1,
    title: 'Basic Info',
    description: 'Name, URL & Category',
    icon: <Info className="h-4 w-4" />,
  },
  {
    id: 2,
    title: 'Content & Copy',
    description: 'Overview & Details',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 3,
    title: 'Tags & Features',
    description: 'Taxonomy & Highlights',
    icon: <Tags className="h-4 w-4" />,
  },
  {
    id: 4,
    title: 'Branding & Visuals',
    description: 'Icon & Rating',
    icon: <Palette className="h-4 w-4" />,
  },
  {
    id: 5,
    title: 'Review & Publish',
    description: 'Live Card Preview',
    icon: <Eye className="h-4 w-4" />,
  },
]

interface WizardStepperProps {
  currentStep: number
  onStepClick?: (stepId: number) => void
}

export function WizardStepper({ currentStep, onStepClick }: WizardStepperProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-4">
        {WIZARD_STEPS.map((step) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          const isClickable = currentStep > step.id

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick?.(step.id)}
              className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                isCurrent
                  ? 'border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                  : isCompleted
                  ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer'
                  : 'border-border/50 bg-secondary/30 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Step Icon Badge */}
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : isCompleted
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step.id}
              </div>

              {/* Step Text */}
              <div className="min-w-0 flex-1">
                <div
                  className={`text-xs font-bold truncate ${
                    isCurrent
                      ? 'text-indigo-400'
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-foreground'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[10px] text-muted-foreground truncate hidden md:block">
                  {step.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

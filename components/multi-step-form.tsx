"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useFormContext } from "@/context/form-context"
import type { FormStep } from "@/types/form-types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MultiStepFormProps {
  steps: FormStep[]
  children: React.ReactNode[]
}

export function MultiStepForm({ steps, children }: MultiStepFormProps) {
  const { currentStep, nextStep, prevStep, isLastStep } = useFormContext()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Convert current step to percentage for progress bar display
    const percentage = (currentStep / (steps.length - 1)) * 100
    setProgress(percentage)
  }, [currentStep, steps.length])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
        <p className="text-muted-foreground">{steps[currentStep].description}</p>
        <Progress value={progress} className="h-2 mt-4" />
      </div>

      <Card>
        <CardContent className="pt-6">{children[currentStep]}</CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        <Button onClick={nextStep} disabled={isLastStep} className="flex items-center gap-2">
          {isLastStep ? "Finish" : "Next"} <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


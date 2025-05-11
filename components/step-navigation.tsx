"use client"

import { useFormContext } from "@/lib/form-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface StepNavigationProps {
  onNext?: () => void
  disableBack?: boolean
  nextDisabled?: boolean
  onBackToHome?: () => void
}

export function StepNavigation({
  onNext,
  disableBack = false,
  nextDisabled = false,
  onBackToHome,
}: StepNavigationProps) {
  const { currentStep, setCurrentStep, totalSteps } = useFormContext()
  const router = useRouter()

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else if (onBackToHome) {
      onBackToHome()
    }
  }

  const handleNext = () => {
    if (onNext) {
      onNext()
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <div className="w-full flex justify-between">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={disableBack && currentStep === 0}
        className="rounded-full flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Button onClick={handleNext} disabled={nextDisabled} className="rounded-full flex items-center gap-2">
        {currentStep === totalSteps - 1 ? "Create My Plan" : "Next"}
        {currentStep !== totalSteps - 1 && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  )
}


"use client"

import { useFormContext } from "@/lib/form-context"
import { DestinationStep } from "./steps/destination-step"
import { BudgetDurationStep } from "./steps/budget-duration-step"
import { ActivitiesStep } from "./steps/activities-step"
import { TripTypeStep } from "./steps/trip-type-step"
import { ColleagueTimezonesStep } from "./steps/colleague-timezones-step"
import { FreeTextPromptStep } from "./steps/free-text-prompt-step"
import { GeneratedSchedule } from "./steps/generated-schedule"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

interface QuestionnaireStepsProps {
  onBack?: () => void
}

export function QuestionnaireSteps({ onBack }: QuestionnaireStepsProps) {
  const { currentStep, generatedSchedule, setGeneratedSchedule } = useFormContext()

  // If we have a generated schedule, show it instead of the form steps
  if (generatedSchedule) {
    return <GeneratedSchedule onBack={onBack} />
  }

  // Otherwise, show the appropriate step based on currentStep
  return (
    <div className="space-y-8">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      )}

      {currentStep === 0 && <DestinationStep onBackToHome={onBack} />}
      {currentStep === 1 && <BudgetDurationStep />}
      {currentStep === 2 && <TripTypeStep />}
      {currentStep === 3 && <ActivitiesStep />}
      {currentStep === 4 && <ColleagueTimezonesStep />}
      {currentStep === 5 && <FreeTextPromptStep />}
    </div>
  )
}


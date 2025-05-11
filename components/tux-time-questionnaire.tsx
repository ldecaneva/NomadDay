"use client"

import { FormProvider } from "@/lib/form-context"
import { QuestionnaireSteps } from "./questionnaire-steps"
import { TuxTimeHeader } from "./tux-time-header"

interface TuxTimeQuestionnaireProps {
  onBack?: () => void
}

export function TuxTimeQuestionnaire({ onBack }: TuxTimeQuestionnaireProps) {
  return (
    <FormProvider>
      <div className="min-h-screen flex flex-col">
        <TuxTimeHeader />
        <div className="flex-1 container max-w-4xl py-8">
          <QuestionnaireSteps onBack={onBack} />
        </div>
      </div>
    </FormProvider>
  )
}


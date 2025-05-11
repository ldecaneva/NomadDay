"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { TripFormData, Activity } from "@/types/form-types"

interface FormContextType {
  formData: TripFormData
  currentStep: number
  updateFormData: (data: Partial<TripFormData>) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  addColleague: () => void
  updateColleague: (index: number, email: string, timezone: string) => void
  removeColleague: (index: number) => void
  toggleActivity: (name: string) => void
  resetForm: () => void
  isLastStep: boolean
}

const defaultActivities: Activity[] = [
  { name: "Parks", selected: false },
  { name: "Museums", selected: false },
  { name: "Sushi", selected: false },
  { name: "Cafés", selected: false },
  { name: "Shopping", selected: false },
  { name: "Nightlife", selected: false },
  { name: "Cultural", selected: false },
  { name: "Outdoor", selected: false },
]

const defaultFormData: TripFormData = {
  destination: "",
  budget: "",
  duration: "",
  tripType: "hybrid",
  importCalendar: false,
  bookMissingComponents: false,
  activities: defaultActivities,
  preferences: "",
  colleagues: [],
  scheduleStyle: "medium",
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<TripFormData>(defaultFormData)
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 5 // Final step shows the results/summary

  const updateFormData = (data: Partial<TripFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
    }
  }

  const addColleague = () => {
    setFormData((prev) => ({
      ...prev,
      colleagues: [...prev.colleagues, { email: "", timezone: "" }],
    }))
  }

  const updateColleague = (index: number, email: string, timezone: string) => {
    const updatedColleagues = [...formData.colleagues]
    updatedColleagues[index] = { email, timezone }
    setFormData((prev) => ({
      ...prev,
      colleagues: updatedColleagues,
    }))
  }

  const removeColleague = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colleagues: prev.colleagues.filter((_, i) => i !== index),
    }))
  }

  const toggleActivity = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.map((activity) =>
        activity.name === name ? { ...activity, selected: !activity.selected } : activity,
      ),
    }))
  }

  const resetForm = () => {
    setFormData(defaultFormData)
    setCurrentStep(0)
  }

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        updateFormData,
        nextStep,
        prevStep,
        goToStep,
        addColleague,
        updateColleague,
        removeColleague,
        toggleActivity,
        resetForm,
        isLastStep: currentStep === totalSteps - 1,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}


"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export type TripType = "work" | "leisure" | "hybrid"
export type ScheduleStyle = "full" | "medium" | "loose"

export interface TripFormData {
  destination: string
  budget: string
  duration: string
  tripType: TripType
  scheduleStyle: ScheduleStyle
  activities: string[]
  importCalendar: boolean
  bookMissingComponents: boolean
  hotelReservation: boolean
  colleagueTimezones: string[]
  freeTextPrompt: string
}

interface FormContextType {
  formData: TripFormData
  updateFormData: (data: Partial<TripFormData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  totalSteps: number
  generatedSchedule: string | null
  setGeneratedSchedule: (schedule: string | null) => void
}

const defaultFormData: TripFormData = {
  destination: "",
  budget: "",
  duration: "",
  tripType: "hybrid",
  scheduleStyle: "medium",
  activities: [],
  importCalendar: false,
  bookMissingComponents: false,
  hotelReservation: false,
  colleagueTimezones: [],
  freeTextPrompt: "",
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<TripFormData>(defaultFormData)
  const [currentStep, setCurrentStep] = useState(0)
  const [generatedSchedule, setGeneratedSchedule] = useState<string | null>(null)

  const totalSteps = 6 // Total number of steps in the form

  const updateFormData = (data: Partial<TripFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        totalSteps,
        generatedSchedule,
        setGeneratedSchedule,
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


export type TripType = "work" | "leisure" | "hybrid"
export type ScheduleStyle = "full" | "medium" | "loose"

export interface Colleague {
  email?: string
  timezone?: string
}

export interface Activity {
  name: string
  selected: boolean
}

export interface TripFormData {
  // Step 1: Basic Info
  destination: string
  budget: string
  duration: string
  tripType: TripType

  // Step 2: Calendar & Travel
  importCalendar: boolean
  bookMissingComponents: boolean

  // Step 3: Activities & Preferences
  activities: Activity[]
  preferences: string

  // Step 4: Work Integration
  colleagues: Colleague[]
  scheduleStyle: ScheduleStyle
}

export interface FormStep {
  id: string
  title: string
  description: string
}


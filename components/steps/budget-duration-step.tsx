"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"
import { useFormContext } from "@/lib/form-context"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { StepNavigation } from "../step-navigation"
import { DollarSign, Calendar } from "lucide-react"

export function BudgetDurationStep() {
  const { formData, updateFormData } = useFormContext()
  const [budget, setBudget] = useState(formData.budget)
  const [duration, setDuration] = useState(formData.duration)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFormData({ budget, duration })
  }

  // Popular budget options for quick selection
  const budgetOptions = ["$500", "$1,000", "$2,000", "$5,000", "Luxury"]

  // Common trip lengths to choose from
  const durationOptions = ["Weekend", "3-5 days", "1 week", "2 weeks", "1 month+"]

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
        <CardTitle className="text-2xl">Budget & Duration</CardTitle>
        <CardDescription>Let us know your budget and how long you'll be traveling</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <label htmlFor="budget" className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" /> What's your budget?
              </label>
              <Input
                id="budget"
                placeholder="e.g., 2000 USD total or 100 EUR/day"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="py-6 text-lg rounded-full border-gray-200 focus:border-primary focus:ring-primary"
                required
              />

              <div className="flex flex-wrap gap-2 mt-2">
                {budgetOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      budget === option ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => setBudget(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="duration" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> How long will you be traveling?
              </label>
              <Input
                id="duration"
                placeholder="e.g., 7 days, 2 weeks, or June 1-15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="py-6 text-lg rounded-full border-gray-200 focus:border-primary focus:ring-primary"
                required
              />

              <div className="flex flex-wrap gap-2 mt-2">
                {durationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      duration === option ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => setDuration(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <StepNavigation
            onNext={() => updateFormData({ budget, duration })}
            nextDisabled={!budget.trim() || !duration.trim()}
          />
        </CardFooter>
      </form>
    </Card>
  )
}


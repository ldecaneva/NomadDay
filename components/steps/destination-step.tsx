"use client"

import type React from "react"
import { useFormContext } from "@/lib/form-context"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { StepNavigation } from "../step-navigation"
import { MapPin, Search } from "lucide-react"

interface DestinationStepProps {
  onBackToHome?: () => void
}

export function DestinationStep({ onBackToHome }: DestinationStepProps) {
  const { formData, updateFormData } = useFormContext()
  const [destination, setDestination] = useState(formData.destination)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFormData({ destination })
  }

  // Trending destinations for easy selection
  const popularDestinations = [
    "Tokyo, Japan",
    "Paris, France",
    "New York, USA",
    "Barcelona, Spain",
    "Sydney, Australia",
    "Bali, Indonesia",
    "London, UK",
    "Rome, Italy",
  ]

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
        <CardTitle className="text-2xl flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Where are you going?
        </CardTitle>
        <CardDescription>Enter your destination to start planning your trip</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="e.g., Tokyo, Japan or Multiple cities in Europe"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 py-6 text-lg rounded-full border-gray-200 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-500">Popular destinations:</div>
              <div className="flex flex-wrap gap-2">
                {popularDestinations.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-sm transition-colors"
                    onClick={() => setDestination(dest)}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <StepNavigation
            onNext={() => updateFormData({ destination })}
            disableBack={!onBackToHome}
            nextDisabled={!destination.trim()}
            onBackToHome={onBackToHome}
          />
        </CardFooter>
      </form>
    </Card>
  )
}


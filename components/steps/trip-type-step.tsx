"use client"

import { useFormContext, type TripType, type ScheduleStyle } from "@/lib/form-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Briefcase, Coffee, Shuffle, Calendar } from "lucide-react"
import { StepNavigation } from "../step-navigation"

export function TripTypeStep() {
  const { formData, updateFormData } = useFormContext()

  const handleTripTypeChange = (value: TripType) => {
    updateFormData({ tripType: value })
  }

  const handleScheduleStyleChange = (value: ScheduleStyle) => {
    updateFormData({ scheduleStyle: value })
  }

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
        <CardTitle className="text-2xl">Trip Configuration</CardTitle>
        <CardDescription>Tell us what kind of trip you're planning</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Shuffle className="h-5 w-5 text-primary" /> Trip Type
            </h3>
            <RadioGroup
              defaultValue={formData.tripType}
              onValueChange={(value) => handleTripTypeChange(value as TripType)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="work" id="work" className="peer sr-only" />
                <Label
                  htmlFor="work"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                >
                  <div className="bg-blue-100 rounded-full p-3 mb-3">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-center font-medium">Work Trip</span>
                  <span className="text-center text-sm text-muted-foreground">Focus on meetings and productivity</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="leisure" id="leisure" className="peer sr-only" />
                <Label
                  htmlFor="leisure"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                >
                  <div className="bg-green-100 rounded-full p-3 mb-3">
                    <Coffee className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-center font-medium">Leisure Trip</span>
                  <span className="text-center text-sm text-muted-foreground">Focus on relaxation and activities</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="hybrid" id="hybrid" className="peer sr-only" />
                <Label
                  htmlFor="hybrid"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                >
                  <div className="bg-purple-100 rounded-full p-3 mb-3">
                    <Shuffle className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-center font-medium">Hybrid Trip</span>
                  <span className="text-center text-sm text-muted-foreground">Balance work and leisure activities</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Schedule Style
            </h3>
            <RadioGroup
              defaultValue={formData.scheduleStyle}
              onValueChange={(value) => handleScheduleStyleChange(value as ScheduleStyle)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="full" id="full" className="peer sr-only" />
                <Label
                  htmlFor="full"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                >
                  <div className="bg-blue-100 rounded-full p-3 mb-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-center font-medium">Full Schedule</span>
                  <span className="text-center text-sm text-muted-foreground">
                    Maximize your time with a packed itinerary
                  </span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                <Label
                  htmlFor="medium"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                >
                  <div className="bg-green-100 rounded-full p-3 mb-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-center font-medium">Medium Schedule</span>
                  <span className="text-center text-sm text-muted-foreground">
                    Balanced itinerary with some free time
                  </span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="loose" id="loose" className="peer sr-only" />
                <Label
                  htmlFor="loose"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                >
                  <div className="bg-purple-100 rounded-full p-3 mb-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-center font-medium">Loose Schedule</span>
                  <span className="text-center text-sm text-muted-foreground">
                    Relaxed pace with plenty of free time
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <StepNavigation onNext={() => {}} />
      </CardFooter>
    </Card>
  )
}


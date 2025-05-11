"use client"

import { useFormContext } from "@/lib/form-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { StepNavigation } from "../step-navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Plus, ListChecks, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const COMMON_ACTIVITIES = [
  "Parks",
  "Museums",
  "Sushi",
  "Cafés",
  "Shopping",
  "Hiking",
  "Beaches",
  "Nightlife",
  "Restaurants",
  "Historical Sites",
  "Art Galleries",
  "Local Markets",
]

export function ActivitiesStep() {
  const { formData, updateFormData } = useFormContext()
  const [selectedActivities, setSelectedActivities] = useState<string[]>(formData.activities || [])
  const [customActivity, setCustomActivity] = useState("")

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity],
    )
  }

  const addCustomActivity = () => {
    if (customActivity.trim() && !selectedActivities.includes(customActivity.trim())) {
      setSelectedActivities((prev) => [...prev, customActivity.trim()])
      setCustomActivity("")
    }
  }

  const handleSubmit = () => {
    updateFormData({ activities: selectedActivities })
  }

  // Assign unique colors to activities for visual distinction
  const getActivityColor = (activity: string) => {
    // Mix the character codes to create a consistent color hash
    const hash = activity.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-yellow-100 text-yellow-800 border-yellow-200",
      "bg-pink-100 text-pink-800 border-pink-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
    ]

    // Use the hash to deterministically select a color
    const index = hash % colors.length
    return colors[index]
  }

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
        <CardTitle className="text-2xl flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" /> Activities & Interests
        </CardTitle>
        <CardDescription>Select activities you're interested in during your trip</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMMON_ACTIVITIES.map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={`activity-${activity}`}
                  checked={selectedActivities.includes(activity)}
                  onCheckedChange={() => toggleActivity(activity)}
                  className="text-primary border-gray-300"
                />
                <Label
                  htmlFor={`activity-${activity}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {activity}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Add custom activity..."
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                className="pl-9 rounded-full border-gray-200 focus:border-primary focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addCustomActivity()
                  }
                }}
              />
            </div>
            <Button
              type="button"
              size="icon"
              onClick={addCustomActivity}
              disabled={!customActivity.trim()}
              className="rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {selectedActivities.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm font-medium mb-3 flex items-center gap-1">
                <Tag className="h-4 w-4 text-primary" /> Selected Activities:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedActivities.map((activity) => {
                  const colorClass = getActivityColor(activity)
                  return (
                    <Badge
                      key={activity}
                      variant="outline"
                      className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${colorClass}`}
                    >
                      {activity}
                      <button
                        className="ml-1 hover:bg-white/20 rounded-full h-4 w-4 inline-flex items-center justify-center"
                        onClick={() => toggleActivity(activity)}
                      >
                        ×
                      </button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <StepNavigation onNext={handleSubmit} />
      </CardFooter>
    </Card>
  )
}


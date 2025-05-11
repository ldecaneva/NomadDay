"use client"

import { useFormContext } from "@/context/form-context"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function ActivitiesStep() {
  const { formData, toggleActivity } = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Select Activities</Label>
        <p className="text-sm text-muted-foreground mb-3">Choose activities you're interested in for your trip</p>

        <div className="flex flex-wrap gap-2">
          {formData.activities.map((activity) => (
            <Badge
              key={activity.name}
              variant={activity.selected ? "default" : "outline"}
              className={`text-sm py-1.5 px-3 cursor-pointer ${
                activity.selected ? "bg-primary hover:bg-primary/90" : ""
              }`}
              onClick={() => toggleActivity(activity.name)}
            >
              {activity.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferences">Tell Tux about your preferences</Label>
        <Textarea
          id="preferences"
          placeholder="e.g., I prefer quiet coworking spaces, love trying local cuisine, interested in historic sites, want to avoid tourist traps..."
          className="min-h-[120px]"
          value={formData.preferences}
          onChange={(e) => (formData.preferences = e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          The more details you provide, the better Tux can tailor your itinerary
        </p>
      </div>
    </div>
  )
}


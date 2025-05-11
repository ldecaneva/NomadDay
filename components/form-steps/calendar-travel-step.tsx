"use client"

import { useFormContext } from "@/context/form-context"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export function CalendarTravelStep() {
  const { formData, updateFormData } = useFormContext()

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Calendar Integration</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="import-calendar">Import Calendar</Label>
            <p className="text-sm text-muted-foreground">Import your existing calendar events and reservations</p>
          </div>
          <Switch
            id="import-calendar"
            checked={formData.importCalendar}
            onCheckedChange={(checked) => updateFormData({ importCalendar: checked })}
          />
        </div>

        {formData.importCalendar && (
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Connect Calendar
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Missing Travel Components</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="book-components">Book Missing Components</Label>
            <p className="text-sm text-muted-foreground">
              Would you like Tux to suggest hotels, flights, trains, etc. based on your budget?
            </p>
          </div>
          <Switch
            id="book-components"
            checked={formData.bookMissingComponents}
            onCheckedChange={(checked) => updateFormData({ bookMissingComponents: checked })}
          />
        </div>

        {formData.bookMissingComponents && (
          <div className="bg-muted/50 p-4 rounded-md">
            <p className="text-sm">
              Tux will suggest travel components that fit your budget and schedule. You'll be able to review and approve
              these suggestions before booking.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


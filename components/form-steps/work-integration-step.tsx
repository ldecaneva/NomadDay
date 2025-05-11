"use client"

import { useFormContext } from "@/context/form-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

export function WorkIntegrationStep() {
  const { formData, updateFormData, addColleague, updateColleague, removeColleague } = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Colleague Timezones</h3>
          <Button variant="outline" size="sm" onClick={addColleague} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Add colleagues you need to coordinate with across different timezones
        </p>

        {formData.colleagues.length === 0 ? (
          <div className="bg-muted/50 p-4 rounded-md text-center text-muted-foreground">
            No colleagues added yet. Add colleagues to optimize meeting times.
          </div>
        ) : (
          <div className="space-y-3">
            {formData.colleagues.map((colleague, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Email or name"
                  value={colleague.email || ""}
                  onChange={(e) => updateColleague(index, e.target.value, colleague.timezone || "")}
                  className="flex-1"
                />
                <Input
                  placeholder="Timezone (e.g., EST, GMT+9)"
                  value={colleague.timezone || ""}
                  onChange={(e) => updateColleague(index, colleague.email || "", e.target.value)}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => removeColleague(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule-style">Schedule Style</Label>
        <Select
          value={formData.scheduleStyle}
          onValueChange={(value) => updateFormData({ scheduleStyle: value as "full" | "medium" | "loose" })}
        >
          <SelectTrigger id="schedule-style">
            <SelectValue placeholder="Select a schedule style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Schedule (Tightly packed)</SelectItem>
            <SelectItem value="medium">Medium (Balanced pace)</SelectItem>
            <SelectItem value="loose">Loose (Plenty of free time)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">This determines how densely packed your itinerary will be</p>
      </div>
    </div>
  )
}


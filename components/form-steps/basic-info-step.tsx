"use client"

import { useFormContext } from "@/context/form-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"

export function BasicInfoStep() {
  const { formData, updateFormData } = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          placeholder="e.g., Tokyo, Japan"
          value={formData.destination}
          onChange={(e) => updateFormData({ destination: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          placeholder="e.g., $100/day or $2000 total"
          value={formData.budget}
          onChange={(e) => updateFormData({ budget: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          placeholder="e.g., 3 days, 1 week"
          value={formData.duration}
          onChange={(e) => updateFormData({ duration: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Trip Type</Label>
        <RadioGroup
          value={formData.tripType}
          onValueChange={(value) => updateFormData({ tripType: value as "work" | "leisure" | "hybrid" })}
          className="flex flex-col space-y-1"
        >
          <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem value="work" />
            </FormControl>
            <FormLabel className="font-normal">Work (Primarily business meetings and calls)</FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem value="leisure" />
            </FormControl>
            <FormLabel className="font-normal">Leisure (Focus on activities and relaxation)</FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem value="hybrid" />
            </FormControl>
            <FormLabel className="font-normal">Hybrid (Balance of work and leisure)</FormLabel>
          </FormItem>
        </RadioGroup>
      </div>
    </div>
  )
}


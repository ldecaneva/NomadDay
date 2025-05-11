"use client"

import { useFormContext } from "@/lib/form-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StepNavigation } from "../step-navigation"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ColleagueTimezonesStep() {
  const { formData, updateFormData } = useFormContext()
  const [colleagueTimezones, setColleagueTimezones] = useState<string[]>(formData.colleagueTimezones || [])
  const [newTimezone, setNewTimezone] = useState("")
  const [importCalendar, setImportCalendar] = useState(formData.importCalendar)
  const [bookMissingComponents, setBookMissingComponents] = useState(formData.bookMissingComponents)
  const [hotelReservation, setHotelReservation] = useState(formData.hotelReservation)

  const addTimezone = () => {
    if (newTimezone.trim() && !colleagueTimezones.includes(newTimezone.trim())) {
      setColleagueTimezones((prev) => [...prev, newTimezone.trim()])
      setNewTimezone("")
    }
  }

  const removeTimezone = (timezone: string) => {
    setColleagueTimezones((prev) => prev.filter((tz) => tz !== timezone))
  }

  const handleSubmit = () => {
    updateFormData({
      colleagueTimezones,
      importCalendar,
      bookMissingComponents,
      hotelReservation,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Calendar & Travel Options</CardTitle>
        <CardDescription>Configure calendar integration and travel components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Calendar Integration</h3>
            <div className="flex items-center space-x-2">
              <Switch id="import-calendar" checked={importCalendar} onCheckedChange={setImportCalendar} />
              <Label htmlFor="import-calendar">Import calendar events</Label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Travel Components</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="book-missing" checked={bookMissingComponents} onCheckedChange={setBookMissingComponents} />
                <Label htmlFor="book-missing">Book missing travel components (flights, trains, etc.)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="hotel-reservation" checked={hotelReservation} onCheckedChange={setHotelReservation} />
                <Label htmlFor="hotel-reservation">Make hotel reservations</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Colleague Timezones</h3>
            <p className="text-sm text-muted-foreground">
              Add timezones for colleagues you'll need to coordinate with during your trip
            </p>

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter colleague email or timezone (e.g., EST, GMT+2)"
                value={newTimezone}
                onChange={(e) => setNewTimezone(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTimezone()
                  }
                }}
              />
              <Button type="button" size="icon" onClick={addTimezone} disabled={!newTimezone.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {colleagueTimezones.length > 0 && (
              <div className="mt-2 space-y-2">
                {colleagueTimezones.map((timezone, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <span>{timezone}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeTimezone(timezone)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <StepNavigation onNext={handleSubmit} />
      </CardFooter>
    </Card>
  )
}


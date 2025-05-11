"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlightOptions } from "@/components/booking/flight-options"
import { HotelOptions } from "@/components/booking/hotel-options"
import { useFormContext } from "@/lib/form-context"
import { Plane, Building, Users, CalendarDays, MapPin, Luggage } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addDays, format } from "date-fns"

export function BookingContainer() {
  const { formData } = useFormContext()
  const [searchParams, setSearchParams] = useState({
    destination: formData.destination,
    departureLocation: "SFO", // Default to SFO
    arrivalLocation: "KIX", // Default to Osaka Kansai for Japan
    startDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 37), "yyyy-MM-dd"),
    adults: 1,
    budget: formData.budget,
  })

  const [activeTab, setActiveTab] = useState("flights")

  // Update departure location
  const updateDepartureLocation = (location: string) => {
    setSearchParams((prev) => ({
      ...prev,
      departureLocation: location.toUpperCase().substring(0, 3),
    }))
  }

  // Update arrival location
  const updateArrivalLocation = (location: string) => {
    setSearchParams((prev) => ({
      ...prev,
      arrivalLocation: location.toUpperCase().substring(0, 3),
    }))
  }

  // Update start date
  const updateStartDate = (date: string) => {
    setSearchParams((prev) => ({
      ...prev,
      startDate: date,
    }))
  }

  // Update end date
  const updateEndDate = (date: string) => {
    setSearchParams((prev) => ({
      ...prev,
      endDate: date,
    }))
  }

  // Update number of travelers
  const updateAdults = (count: number) => {
    setSearchParams((prev) => ({
      ...prev,
      adults: count,
    }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-6">
      <Card className="w-full overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Luggage className="h-5 w-5 text-primary" /> Book Travel Components
            </CardTitle>
            <CardDescription className="mt-1">
              Find and book flights, hotels, and more for your trip to {formData.destination}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleFormSubmit} className="mb-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure-location" className="flex items-center gap-1 font-medium">
                  <MapPin className="h-4 w-4 text-primary" /> Departure Airport
                </Label>
                <Input
                  id="departure-location"
                  placeholder="Enter airport code (e.g., SFO)"
                  value={searchParams.departureLocation}
                  onChange={(e) => updateDepartureLocation(e.target.value)}
                  className="uppercase rounded-full border-gray-300 focus:border-primary focus:ring-primary"
                  maxLength={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrival-location" className="flex items-center gap-1 font-medium">
                  <MapPin className="h-4 w-4 text-primary" /> Arrival Airport
                </Label>
                <Input
                  id="arrival-location"
                  placeholder="Enter airport code (e.g., KIX)"
                  value={searchParams.arrivalLocation}
                  onChange={(e) => updateArrivalLocation(e.target.value)}
                  className="uppercase rounded-full border-gray-300 focus:border-primary focus:ring-primary"
                  maxLength={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-range" className="flex items-center gap-1 font-medium">
                  <CalendarDays className="h-4 w-4 text-primary" /> Travel Dates
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="start-date"
                    type="date"
                    value={searchParams.startDate}
                    onChange={(e) => updateStartDate(e.target.value)}
                    className="rounded-full border-gray-300 focus:border-primary focus:ring-primary"
                  />
                  <Input
                    id="end-date"
                    type="date"
                    value={searchParams.endDate}
                    onChange={(e) => updateEndDate(e.target.value)}
                    className="rounded-full border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers" className="flex items-center gap-1 font-medium">
                  <Users className="h-4 w-4 text-primary" /> Travelers
                </Label>
                <Input
                  id="travelers"
                  type="number"
                  min={1}
                  max={10}
                  value={searchParams.adults}
                  onChange={(e) => updateAdults(Number.parseInt(e.target.value) || 1)}
                  className="rounded-full border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
          </form>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2 rounded-full p-1 bg-gray-100">
              <TabsTrigger
                value="flights"
                className="rounded-full flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary"
              >
                <Plane className="h-4 w-4" /> Flights
              </TabsTrigger>
              <TabsTrigger
                value="hotels"
                className="rounded-full flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary"
              >
                <Building className="h-4 w-4" /> Hotels
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flights" className="mt-6">
              <FlightOptions searchParams={searchParams} />
            </TabsContent>

            <TabsContent value="hotels" className="mt-6">
              <HotelOptions searchParams={searchParams} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


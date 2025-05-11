"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import type { FlightOption, SearchParams } from "@/lib/booking-service"
import { searchFlights } from "@/lib/booking-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, Filter, ArrowUpDown, AlertCircle, Plane, Clock } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface FlightOptionsProps {
  searchParams: SearchParams
}

export function FlightOptions({ searchParams }: FlightOptionsProps) {
  const [flights, setFlights] = useState<FlightOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price")
  const [filterNonstop, setFilterNonstop] = useState(false)

  // API handler for flight search
  const loadFlights = async () => {
    setIsLoading(true)
    setError(null)

    // Need both locations to search
    if (!searchParams.departureLocation || !searchParams.arrivalLocation) {
      setError("Both departure and arrival locations are required to search for flights.")
      setIsLoading(false)
      return
    }

    try {
      // Use the searchFlights function from booking-service
      const flights = await searchFlights(searchParams)
      setFlights(flights)

      // No flights? Tell the user
      if (flights.length === 0) {
        setError("No flights found for your search criteria. Try different dates or locations.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load flight options. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Sort and filter flights
  const sortedAndFilteredFlights = () => {
    const filtered = filterNonstop ? flights.filter((f) => f.stops === 0) : flights

    return filtered.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "duration") {
        return a.duration.localeCompare(b.duration)
      }
      return a.departureTime.localeCompare(b.departureTime)
    })
  }

  const displayFlights = sortedAndFilteredFlights()

  // Currency display helper
  const formatPrice = (price: number, currency?: string) => {
    // Default to dollars if no currency specified
    const actualCurrency = currency || "USD"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: actualCurrency }).format(price)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  // Create consistent color coding for airlines
  const getAirlineColor = (airline: string) => {
    // Hash the airline name for color consistency
    const hash = airline.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)

    const colors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-green-100 border-green-300 text-green-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-yellow-100 border-yellow-300 text-yellow-800",
      "bg-pink-100 border-pink-300 text-pink-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
    ]

    // Use the hash to deterministically select a color
    const index = hash % colors.length
    return colors[index]
  }

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Plane className="h-5 w-5 text-primary" /> Flight Options
            </CardTitle>
            <CardDescription className="mt-1 font-medium">
              {searchParams.departureLocation} → {searchParams.arrivalLocation}
            </CardDescription>
          </div>
          {flights.length === 0 && !isLoading && (
            <form onSubmit={handleFormSubmit}>
              <Button type="submit" onClick={loadFlights} className="rounded-full px-6">
                Search Flights
              </Button>
            </form>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <Plane className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="mt-4 text-lg">Finding the perfect flights for you...</span>
          </div>
        ) : error ? (
          <div className="p-6">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : flights.length > 0 ? (
          <div>
            <div className="sticky top-0 z-10 bg-white border-b p-4 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <span className="font-medium">Filters:</span>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="nonstop"
                    checked={filterNonstop}
                    onCheckedChange={(checked) => setFilterNonstop(!!checked)}
                    className="text-primary"
                  />
                  <Label htmlFor="nonstop" className="cursor-pointer">
                    Non-stop only
                  </Label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-primary" />
                <span className="font-medium">Sort by:</span>
                <RadioGroup
                  defaultValue={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-1">
                    <RadioGroupItem id="price-sort" value="price" />
                    <Label htmlFor="price-sort" className="cursor-pointer">
                      Price
                    </Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroupItem id="duration-sort" value="duration" />
                    <Label htmlFor="duration-sort" className="cursor-pointer">
                      Duration
                    </Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroupItem id="departure-sort" value="departure" />
                    <Label htmlFor="departure-sort" className="cursor-pointer">
                      Departure
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="divide-y">
              {displayFlights.length > 0 ? (
                displayFlights.map((flight) => {
                  const airlineColor = getAirlineColor(flight.airline)

                  return (
                    <div key={flight.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-wrap items-center gap-6">
                        {/* Airline info */}
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <div
                            className={`relative h-12 w-12 rounded-full p-1 flex items-center justify-center ${airlineColor.split(" ")[0]} border ${airlineColor.split(" ")[1]}`}
                          >
                            <Image
                              src={flight.logo || "/placeholder.svg"}
                              alt={flight.airline}
                              fill
                              className="object-contain p-2"
                              unoptimized
                            />
                          </div>
                          <div>
                            <div className="font-bold">{flight.airline}</div>
                            <Badge variant={flight.stops === 0 ? "default" : "outline"} className="mt-1">
                              {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                            </Badge>
                          </div>
                        </div>

                        {/* Flight timeline */}
                        <div className="flex-1 flex items-center justify-between max-w-md">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{flight.departureTime}</div>
                            <div className="text-sm font-medium bg-gray-100 rounded-full px-3 py-1 mt-1">
                              {flight.departureAirport}
                            </div>
                          </div>

                          <div className="flex flex-col items-center px-4">
                            <div className="text-xs text-gray-500 mb-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> {flight.duration}
                            </div>
                            <div className="relative w-32 h-4">
                              <div className="absolute h-0.5 bg-primary/30 top-1/2 left-0 right-0 transform -translate-y-1/2"></div>
                              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                              <Plane className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-primary" />
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-2xl font-bold">{flight.arrivalTime}</div>
                            <div className="text-sm font-medium bg-gray-100 rounded-full px-3 py-1 mt-1">
                              {flight.arrivalAirport}
                            </div>
                          </div>
                        </div>

                        {/* Price and booking */}
                        <div className="ml-auto flex flex-col items-end min-w-[120px]">
                          <div className="text-2xl font-bold text-primary">
                            {formatPrice(flight.price, flight.currency)}
                          </div>
                          <Button asChild className="mt-2 rounded-full" size="sm">
                            <a href={flight.bookingUrl} target="_blank" rel="noopener noreferrer">
                              Book Flight <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <div className="text-lg font-medium">No flights match your filters</div>
                  <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-primary/10 rounded-full p-6 mb-4">
              <Plane className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Ready to take off?</h3>
            <p className="text-center text-gray-500 mb-6 max-w-md">
              Enter valid 3-letter airport codes for both departure and arrival to find available flights.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 text-sm">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <span className="font-bold">SFO</span>
                <p className="text-xs text-gray-500">San Francisco</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <span className="font-bold">LAX</span>
                <p className="text-xs text-gray-500">Los Angeles</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <span className="font-bold">KIX</span>
                <p className="text-xs text-gray-500">Osaka</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <span className="font-bold">NRT</span>
                <p className="text-xs text-gray-500">Tokyo</p>
              </div>
            </div>
            <form onSubmit={handleFormSubmit}>
              <Button type="submit" onClick={loadFlights} className="rounded-full px-8 py-6 text-lg">
                Search Flights
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


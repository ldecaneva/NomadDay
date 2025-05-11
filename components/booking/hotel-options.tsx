"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import type { HotelOption, SearchParams } from "@/lib/booking-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  ExternalLink,
  Filter,
  ArrowUpDown,
  Star,
  StarHalf,
  AlertCircle,
  Building,
  Wifi,
  Coffee,
  Utensils,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface HotelOptionsProps {
  searchParams: SearchParams
}

export function HotelOptions({ searchParams }: HotelOptionsProps) {
  const [hotels, setHotels] = useState<HotelOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"price" | "stars" | "rating">("price")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [minStars, setMinStars] = useState(0)

  // Fetch hotel data from backend API
  const loadHotels = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Hit the hotels endpoint with search params
      const response = await fetch("/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchParams),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch hotels")
      }

      const data = await response.json()
      setHotels(data.hotels)

      // Adjust slider range based on actual price data
      if (data.hotels.length > 0) {
        const prices = data.hotels.map((h: HotelOption) => h.price)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        setPriceRange([minPrice, maxPrice])
      }

      // Let user know if search returned empty
      if (data.hotels.length === 0) {
        setError("No hotels found for your search criteria. Try a different destination.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hotel options. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters and sorting to hotel results
  const sortedAndFilteredHotels = () => {
    // Apply price and star filters
    const filtered = hotels.filter((h) => h.price >= priceRange[0] && h.price <= priceRange[1] && h.stars >= minStars)

    // Order results by user's preference
    return filtered.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "stars") return b.stars - a.stars
      return b.rating - a.rating
    })
  }

  const displayHotels = sortedAndFilteredHotels()

  // Pretty format the price with currency
  const formatPrice = (price: number, currency: string, perNight: boolean) => {
    return `${new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price)}${perNight ? "/night" : ""}`
  }

  // Display stars based on hotel rating
  const renderStars = (count: number) => {
    const stars = []
    const fullStars = Math.floor(count)
    const hasHalfStar = count % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    return <div className="flex">{stars}</div>
  }

  // Match amenity to appropriate icon
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes("wifi")) return <Wifi className="h-3 w-3" />
    if (amenityLower.includes("breakfast")) return <Coffee className="h-3 w-3" />
    if (amenityLower.includes("restaurant")) return <Utensils className="h-3 w-3" />
    return null
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building className="h-5 w-5 text-primary" /> Hotel Options
            </CardTitle>
            <CardDescription className="mt-1 font-medium">
              Find the best accommodations in {searchParams.destination}
            </CardDescription>
          </div>
          {hotels.length === 0 && !isLoading && (
            <form onSubmit={handleFormSubmit}>
              <Button type="submit" onClick={loadHotels} className="rounded-full px-6">
                Search Hotels
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
              <Building className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="mt-4 text-lg">Finding the perfect accommodations for you...</span>
          </div>
        ) : error ? (
          <div className="p-6">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : hotels.length > 0 ? (
          <div>
            <div className="sticky top-0 z-10 bg-white border-b p-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" /> Price Range
                    </h3>
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={500}
                      step={10}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Minimum Star Rating</h3>
                    <RadioGroup
                      defaultValue={minStars.toString()}
                      onValueChange={(value) => setMinStars(Number.parseInt(value))}
                      className="flex gap-4"
                    >
                      {[0, 3, 4, 5].map((stars) => (
                        <div key={stars} className="flex items-center gap-1">
                          <RadioGroupItem id={`stars-${stars}`} value={stars.toString()} />
                          <Label htmlFor={`stars-${stars}`} className="cursor-pointer">
                            {stars === 0 ? "Any" : `${stars}+ Stars`}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-primary" /> Sort by
                  </h3>
                  <RadioGroup
                    defaultValue={sortBy}
                    onValueChange={(value) => setSortBy(value as any)}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div className="flex items-center gap-1">
                      <RadioGroupItem id="price-sort" value="price" />
                      <Label htmlFor="price-sort" className="cursor-pointer">
                        Price
                      </Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem id="stars-sort" value="stars" />
                      <Label htmlFor="stars-sort" className="cursor-pointer">
                        Stars
                      </Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem id="rating-sort" value="rating" />
                      <Label htmlFor="rating-sort" className="cursor-pointer">
                        Rating
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="p-4 grid md:grid-cols-2 gap-4">
              {displayHotels.length > 0 ? (
                displayHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="rounded-xl overflow-hidden bg-white border hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 font-bold text-primary shadow-md">
                        {formatPrice(hotel.price, hotel.currency, hotel.perNight)}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{hotel.name}</h3>
                          <p className="text-sm text-muted-foreground">{hotel.location}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <span className="font-bold">{hotel.rating}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-500">({hotel.reviewCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center mb-3">{renderStars(hotel.stars)}</div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hotel.amenities.map((amenity, i) => (
                            <Badge key={i} variant="outline" className="flex items-center gap-1 bg-gray-50">
                              {getAmenityIcon(amenity)}
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button asChild className="w-full rounded-full">
                        <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">
                          View Deal <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 col-span-2">
                  <div className="text-lg font-medium">No hotels match your filters</div>
                  <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-primary/10 rounded-full p-6 mb-4">
              <Building className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Find your perfect stay</h3>
            <p className="text-center text-gray-500 mb-6 max-w-md">
              Discover hotels, resorts, and vacation rentals in {searchParams.destination}
            </p>
            <form onSubmit={handleFormSubmit}>
              <Button type="submit" onClick={loadHotels} className="rounded-full px-8 py-6 text-lg">
                Search Hotels
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


import { NextResponse } from "next/server"
import type { SearchParams } from "@/lib/booking-service"
import { searchFlights } from "@/lib/booking-service"

export async function POST(request: Request) {
  try {
    // Parse search parameters from request
    const searchParams: SearchParams = await request.json()

    // Validate required parameters
    if (!searchParams.departureLocation || !searchParams.arrivalLocation) {
      return NextResponse.json(
        {
          error: "Both departure and arrival airport codes are required",
          details: "Please provide valid 3-letter IATA airport codes",
        },
        { status: 400 },
      )
    }

    // For now, use our mock service instead of the Amadeus API
    // This will help us debug the UI without API issues
    const flights = await searchFlights(searchParams)

    return NextResponse.json({ flights })
  } catch (error) {
    console.error("Error in flights API:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}


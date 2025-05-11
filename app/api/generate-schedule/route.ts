import { NextResponse } from "next/server"
import type { TripFormData } from "@/lib/form-context"
import { enhanceScheduleWithPlaces, shouldEnhanceWithPlaces } from "@/lib/places-api"

// Define a consistent prompt template
const SYSTEM_PROMPT = `You are TuxTime, an AI travel assistant specialized in creating detailed travel itineraries. 
Follow these guidelines to ensure consistency:

1. FORMAT: Format your response in clean HTML with h2, h3, ul, li, and strong tags. DO NOT use markdown code blocks.
2. STRUCTURE: Always include these sections in this order:
   - Title (h2): "Your [Schedule Style] Schedule for [Destination]"
   - Introduction paragraph
   - Daily Overview (h3) with bullet points for morning, afternoon, and evening activities
   - Day-by-day breakdown (h3 for each day) with specific times, locations, and estimated costs
   - Additional Recommendations section with workspace, transportation, and accommodation suggestions
3. SPECIFICITY: Always include specific:
   - Times in the format "9:00 AM" (not "morning" or "afternoon")
   - Location names (not "a local restaurant" but "Sakura Sushi Restaurant")
   - Cost estimates in the format "$XX" or "¥XX" depending on the destination
4. PLACE NAMES: Use clear, simple place names:
   - Just use the main name (e.g., "Sisterfields" not "Kismet Sisterfields & Boutique")
   - Don't add location information after the name (e.g., "Louvre Museum" not "Louvre Museum, Paris")
   - Don't add descriptors unless they're part of the official name
5. CONSISTENCY: Maintain the same level of detail for each day
6. STYLE: Use a friendly, concise tone throughout
7. AVOID DUPLICATES: Never repeat place names or ratings in the same entry

The schedule should be practical, actionable, and tailored to the user's preferences.`

export async function POST(request: Request) {
  try {
    const { formData } = await request.json()

    if (!formData) {
      return NextResponse.json({ error: "Form data is required" }, { status: 400 })
    }

    // Get API keys from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY
    const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured on server" }, { status: 500 })
    }

    // Build the prompt
    const prompt = buildStructuredPrompt(formData)

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        {
          error: error.error?.message || "Failed to generate schedule",
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    let generatedSchedule = data.choices[0].message.content

    // Clean up any markdown code blocks that might be in the response
    generatedSchedule = generatedSchedule.replace(/```html|```/g, "").trim()

    // Check if the schedule has specific recommendations
    // If not, enhance it with Google Places API data
    if (googlePlacesApiKey && shouldEnhanceWithPlaces(generatedSchedule, formData)) {
      generatedSchedule = await enhanceScheduleWithPlaces(generatedSchedule, formData, googlePlacesApiKey)
    }

    return NextResponse.json({ schedule: generatedSchedule })
  } catch (error) {
    console.error("Error generating schedule:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

function buildStructuredPrompt(formData: TripFormData): string {
  const {
    destination,
    budget,
    duration,
    tripType,
    scheduleStyle,
    activities,
    importCalendar,
    bookMissingComponents,
    hotelReservation,
    colleagueTimezones,
    freeTextPrompt,
  } = formData

  // Build a structured prompt for the AI model
  let prompt = `Create a detailed travel itinerary for a ${tripType} trip to ${destination} with a budget of ${budget} for ${duration}.`

  // Add schedule style preference
  prompt += ` The schedule should be ${scheduleStyle} (${scheduleStyle === "full" ? "packed with activities" : scheduleStyle === "medium" ? "balanced with some free time" : "relaxed with plenty of free time"}).`

  // Add activities
  if (activities.length > 0) {
    prompt += ` Include the following activities: ${activities.join(", ")}.`
  }

  // Add colleague timezones if applicable
  if (colleagueTimezones.length > 0) {
    prompt += ` Optimize the schedule for meetings with colleagues in these timezones: ${colleagueTimezones.join(", ")}.`
  }

  // Add booking preferences
  if (bookMissingComponents) {
    prompt += ` Include recommendations for flights, trains, and other transportation options.`
  }

  if (hotelReservation) {
    prompt += ` Include hotel recommendations that fit within the budget.`
  }

  // Add any free text prompt
  if (freeTextPrompt) {
    prompt += ` Additional preferences: ${freeTextPrompt}`
  }

  // Format instructions
  prompt += ` 
  
  IMPORTANT: Your response MUST include:
  1. Specific place names (not generic "local restaurant" or "museum")
  2. Exact times for each activity (e.g., "9:00 AM", not just "morning")
  3. Estimated costs for activities, meals, and transportation using $ symbols
  4. If this is a work or hybrid trip, include specific coworking spaces or quiet cafés with good WiFi
  5. Keep descriptions brief - focus on the name, price, and a very short comment
  
  Format the response as a detailed day-by-day itinerary with specific times, locations, and estimated costs.
  
  IMPORTANT: For each place mentioned, use ONLY the main name. For example, write "Dinner at Sisterfields ($30)" not "Dinner at Kismet Sisterfields & Boutique, Ubud ($30)".
  
  AVOID DUPLICATES: Never repeat place names or ratings in the same entry.`

  return prompt
}


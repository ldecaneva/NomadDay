import { NextResponse } from "next/server"
import {
  enhanceScheduleWithPlaces,
  shouldEnhanceWithPlaces,
  getRecommendations,
  formatRecommendations,
} from "@/lib/places-api"

// Define a consistent system prompt for chat
const CHAT_SYSTEM_PROMPT = `You are TuxTime, an AI travel assistant. You are helping a user with their trip. 
Follow these guidelines to ensure consistency:

1. TONE: Be friendly, helpful, and concise. Use a consistent voice throughout.
2. FORMATTING: Use clean HTML for any structured content. Use <p>, <ul>, <li>, and <strong> tags appropriately.
3. PLACE NAMES: Use clear, simple place names:
   - Just use the main name (e.g., "Sisterfields" not "Kismet Sisterfields & Boutique")
   - Don't add location information after the name (e.g., "Louvre Museum" not "Louvre Museum, Paris")
   - Don't add descriptors unless they're part of the official name
4. MODIFICATIONS: When modifying a schedule:
   - Always maintain the same structure and style as the original
   - Keep the same level of specificity for times, locations, and costs
   - Explain what changes you made clearly
   - Return the complete updated schedule, not just the changes
   - AVOID DUPLICATES: Never repeat place names or ratings
5. RECOMMENDATIONS: When making recommendations:
   - Be specific (name actual places, not generic "local restaurant")
   - Keep it brief - just the name and a short comment
   - Mention price ranges when relevant using $ symbols
   - IMPORTANT: For each activity, recommend only ONE place, not multiple
6. ANSWERS: When answering questions:
   - Be direct and to the point
   - Provide factual information when possible
   - Acknowledge when you don't know something

Remember that your goal is to help the user have the best possible trip experience.`

export async function POST(request: Request) {
  try {
    const { message, schedule, formData } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!schedule) {
      return NextResponse.json({ error: "Schedule is required" }, { status: 400 })
    }

    // Get API keys from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY
    const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured on server" }, { status: 500 })
    }

    // Enhance the user's message with specific instructions for consistency
    const enhancedMessage = enhanceUserMessage(message)

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
            content: `${CHAT_SYSTEM_PROMPT}
            
            Current schedule:
            ${schedule}
            
            Trip details:
            Destination: ${formData.destination}
            Duration: ${formData.duration}
            Trip Type: ${formData.tripType}
            Budget: ${formData.budget}`,
          },
          {
            role: "user",
            content: enhancedMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        {
          error: error.error?.message || "Failed to get response",
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const chatResponse = data.choices[0].message.content

    // Check if the response contains HTML tags that indicate a schedule update
    const containsScheduleUpdate = /<h[1-6]>|<ul>|<li>/.test(chatResponse)

    // If it looks like a schedule update, extract the schedule part
    let updatedSchedule = null
    let responseText = chatResponse

    if (containsScheduleUpdate) {
      // Try to extract the explanation part (usually at the beginning)
      const explanationMatch = chatResponse.match(/^(.*?)(<h[1-6]>|<ul>)/s)
      const explanation = explanationMatch ? explanationMatch[1].trim() : "Here's your updated schedule:"

      // The rest is the updated schedule
      updatedSchedule = chatResponse.replace(explanation, "").trim()

      // Set the response text to just the explanation
      responseText = `${explanation} <p><em>Schedule has been updated!</em></p>`

      // If we have Google Places API and the schedule lacks specific recommendations,
      // enhance it with place data
      if (googlePlacesApiKey && shouldEnhanceWithPlaces(updatedSchedule, formData)) {
        updatedSchedule = await enhanceScheduleWithPlaces(updatedSchedule, formData, googlePlacesApiKey)
      }
    } else if (isRequestingRecommendations(message) && googlePlacesApiKey) {
      // If user is asking for recommendations but the response doesn't have specific places
      responseText = await enhanceResponseWithRecommendations(responseText, message, formData, googlePlacesApiKey)
    }

    return NextResponse.json({
      response: responseText,
      updatedSchedule: updatedSchedule,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

// Function to enhance the user message with specific instructions for consistency
function enhanceUserMessage(message: string): string {
  // Check if the message is asking for a modification
  if (/change|modify|update|reschedule|move|add|remove/.test(message.toLowerCase())) {
    return `${message}

IMPORTANT: If you're modifying the schedule, please:
1. Be specific with times, locations, and activities
2. Maintain the same format and structure as the original schedule
3. Return the complete updated schedule with all changes applied
4. For each activity, recommend only ONE place, not multiple
5. AVOID DUPLICATES: Never repeat place names or ratings
6. Keep place names simple (e.g., "Sisterfields" not "Kismet Sisterfields & Boutique, Ubud")`
  }

  // Check if the message is asking for recommendations
  if (/recommend|suggestion|where|what|place|restaurant|hotel|activity|visit/.test(message.toLowerCase())) {
    return `${message}

IMPORTANT: Please provide specific recommendations with:
1. Just the place name, no lengthy descriptions
2. Price range using $ symbols
3. Rating if available
4. For each activity, recommend only ONE place, not multiple
5. AVOID DUPLICATES: Never repeat place names or ratings
6. Keep place names simple (e.g., "Sisterfields" not "Kismet Sisterfields & Boutique")`
  }

  return message
}

// Function to check if the user is requesting recommendations
function isRequestingRecommendations(message: string): boolean {
  const recommendationKeywords = [
    "recommend",
    "suggestion",
    "where should",
    "what should",
    "good place",
    "restaurant",
    "hotel",
    "activity",
    "visit",
    "things to do",
    "where to eat",
    "where to stay",
  ]

  return recommendationKeywords.some((keyword) => message.toLowerCase().includes(keyword))
}

// Function to enhance responses with specific place recommendations
async function enhanceResponseWithRecommendations(
  response: string,
  message: string,
  formData: any,
  apiKey: string,
): Promise<string> {
  try {
    // Determine what type of recommendation is needed
    let queryType = "attractions"

    if (/restaurant|food|eat|dining|dinner|lunch|breakfast/.test(message.toLowerCase())) {
      queryType = "restaurants"
    } else if (/hotel|stay|accommodation|lodging/.test(message.toLowerCase())) {
      queryType = "hotels"
    } else if (/museum|art|culture|history/.test(message.toLowerCase())) {
      queryType = "museums"
    } else if (/park|nature|outdoor|garden/.test(message.toLowerCase())) {
      queryType = "parks"
    } else if (/coffee|café|cafe/.test(message.toLowerCase())) {
      queryType = "cafes"
    } else if (/work|coworking|office|workspace/.test(message.toLowerCase())) {
      queryType = "coworking spaces"
    } else if (/shop|shopping|mall|store/.test(message.toLowerCase())) {
      queryType = "shopping"
    }

    // Get recommendations from Google Places API
    const places = await getRecommendations(formData.destination, queryType, apiKey, 3)

    if (places.length > 0) {
      // Format recommendations in a simplified, colorful way
      const recommendationsHtml = formatRecommendations(places)

      // Append recommendations to the original response
      return `${response}
      
      <p>Here are some specific recommendations for you:</p>
      ${recommendationsHtml}`
    }

    return response
  } catch (error) {
    console.error("Error enhancing response with recommendations:", error)
    return response
  }
}


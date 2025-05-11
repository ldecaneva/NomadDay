import type { TripFormData } from "./form-context"

// Function to enhance a schedule with Google Places API data
export async function enhanceScheduleWithPlaces(
  schedule: string,
  formData: TripFormData,
  apiKey: string,
): Promise<string> {
  try {
    // First, add the style definitions to the schedule
    schedule = addStyleDefinitions(schedule)

    // Extract place names from the schedule
    const placeNames = extractPlaceNames(schedule)

    if (placeNames.length === 0) {
      return schedule
    }

    // For each place name, get a recommendation from Google Places
    for (const placeName of placeNames) {
      const placeRecommendation = await getPlaceRecommendationByName(formData.destination, placeName, apiKey)

      if (placeRecommendation) {
        // Replace the place name with a hyperlink but keep the original name
        schedule = addHyperlinkToPlace(schedule, placeName, placeRecommendation)
      }
    }

    // Apply consistent price formatting
    schedule = applyConsistentPriceFormatting(schedule)

    // Clean up any duplicate place names and ratings
    schedule = cleanupDuplicates(schedule)

    return schedule
  } catch (error) {
    console.error("Error enhancing schedule with places:", error)
    return schedule // Return original schedule if enhancement fails
  }
}

// Add style definitions to the schedule
function addStyleDefinitions(schedule: string): string {
  const styleBlock = `
<style>
  .place-link { color: #10B981; font-weight: 500; text-decoration: none; }
  .place-link:hover { text-decoration: underline; }
  .price { color: #3B82F6; font-weight: 600; } /* Blue color for prices */
  .rating { color: #8B5CF6; font-weight: 600; } /* Purple color for ratings */
</style>
`

  // Only add the style block if it's not already there
  if (!schedule.includes("<style>")) {
    schedule = styleBlock + schedule
  }

  return schedule
}

// Helper function to extract place names from the schedule
function extractPlaceNames(schedule: string): string[] {
  const placeNames: string[] = []

  // Look for patterns like "Visit X", "Lunch at Y", etc.
  const patterns = [
    /(?:Visit|Explore|Tour|See|Check out)\s+([A-Z][A-Za-z\s']+?)(?:\s+\(|\s*$|\s*-)/g,
    /(?:Lunch|Dinner|Breakfast|Coffee|Drinks|Eat)\s+at\s+([A-Z][A-Za-z\s']+?)(?:\s+\(|\s*$|\s*-)/g,
    /(?:Stay|Check-in|Accommodation)\s+at\s+([A-Z][A-Za-z\s']+?)(?:\s+\(|\s*$|\s*-)/g,
    /(?:Work|Meeting)\s+at\s+([A-Z][A-Za-z\s']+?)(?:\s+\(|\s*$|\s*-)/g,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(schedule)) !== null) {
      const placeName = match[1].trim()
      if (placeName && !placeNames.includes(placeName)) {
        placeNames.push(placeName)
      }
    }
  }

  return placeNames
}

// Function to get a place recommendation by name from Google Places API
async function getPlaceRecommendationByName(
  destination: string,
  placeName: string,
  apiKey: string,
): Promise<any | null> {
  try {
    // Build the search query with the place name and destination
    const query = `${placeName} in ${destination}`
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      // Return the first result as it's most likely to match the name
      return data.results[0]
    }

    return null
  } catch (error) {
    console.error("Error fetching place recommendation:", error)
    return null
  }
}

// Function to add a hyperlink to a place name
function addHyperlinkToPlace(schedule: string, placeName: string, placeRecommendation: any): string {
  // Create a Google Maps URL for the place
  const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeRecommendation.place_id}`

  // Create a regex that matches the place name but not if it's already in a link
  const regex = new RegExp(`(?<!<a[^>]*>)(${escapeRegExp(placeName)})(?![^<]*<\/a>)`, "g")

  // Replace the place name with a hyperlink
  return schedule.replace(regex, `<a href="${mapsUrl}" target="_blank" class="place-link">$1</a>`)
}

// Helper function to escape special characters in regex
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Function to clean up duplicate place names and ratings
function cleanupDuplicates(schedule: string): string {
  // Fix duplicate place names with links
  const linkPattern =
    /<a href="[^"]*" target="_blank" class="place-link">([^<]+)<\/a>(\s+<a href="[^"]*" target="_blank" class="place-link">\1<\/a>)+/g
  schedule = schedule.replace(linkPattern, '<a href="$1" target="_blank" class="place-link">$1</a>')

  // Fix duplicate ratings
  schedule = schedule.replace(
    /($$\s*<span class="[^"]*">[\d.]+★<\/span>\s*$$)(\s*$$\s*<span class="[^"]*">[\d.]+★<\/span>\s*$$)+/g,
    "$1",
  )

  // Fix plain duplicate ratings without spans
  schedule = schedule.replace(/($$\s*[\d.]+★\s*$$)(\s*$$\s*[\d.]+★\s*$$)+/g, "$1")

  // Fix duplicate place names in text
  schedule = schedule.replace(/(\b[A-Z][a-z]+\s+[A-Z][a-z]+\b)(\s+\1\b)+/g, "$1")

  // Fix "The X of Y (rating) of Z (rating)" patterns
  schedule = schedule.replace(/(\w+\s+of\s+\w+\s*$$[\d.]+★$$)\s+of\s+\w+\s*$$[\d.]+★$$/g, "$1")

  return schedule
}

// Function to determine if we should enhance with Google Places data
export function shouldEnhanceWithPlaces(schedule: string, formData: TripFormData): boolean {
  // Count how many hyperlinks are already in the schedule
  const linkCount = (schedule.match(/<a href/g) || []).length

  // If there are fewer than 5 hyperlinks, enhance with Google Places
  return linkCount < 5
}

// Function to get recommendations for a specific query
export async function getRecommendations(
  destination: string,
  query: string,
  apiKey: string,
  limit = 3,
): Promise<any[]> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)} in ${encodeURIComponent(destination)}&key=${apiKey}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      return data.results.slice(0, limit)
    }

    return []
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return []
  }
}

// Function to format recommendations in a simplified, colorful way
export function formatRecommendations(places: any[]): string {
  if (places.length === 0) {
    return ""
  }

  let html = `<div class="space-y-3 mt-4">`

  places.forEach((place) => {
    const name = place.name
    const rating = place.rating ? place.rating : 4.0
    const priceLevel = place.price_level ? place.price_level : 2
    const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
    const priceDisplay = "$".repeat(priceLevel || 2)

    html += `
    <div class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
      <a href="${mapsUrl}" target="_blank" class="place-link">${name}</a>
      <div class="flex items-center gap-3 mt-1">
        <span class="rating">${rating}★</span>
        <span class="price">${priceDisplay}</span>
      </div>
    </div>
    `
  })

  html += `</div>`
  return html
}

// Function to apply consistent price formatting to the entire schedule
function applyConsistentPriceFormatting(schedule: string): string {
  // Format dollar amounts like $30, $150, etc.
  schedule = schedule.replace(/\$(\d+)(?!★)/g, (match) => {
    return `<span class="price">${match}</span>`
  })

  // Format price ranges like $30-$50
  schedule = schedule.replace(/\$(\d+)-\$(\d+)/g, (match) => {
    return `<span class="price">${match}</span>`
  })

  // Format prices with /day, /night, etc.
  schedule = schedule.replace(/\$(\d+)\/(\w+)/g, (match) => {
    return `<span class="price">${match}</span>`
  })

  // Format ratings like 4.5★
  schedule = schedule.replace(/(\d\.\d)★/g, (match) => {
    return `<span class="rating">${match}</span>`
  })

  return schedule
}


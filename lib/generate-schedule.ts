import type { TripFormData } from "./form-context"

export async function generateSchedule(formData: TripFormData): Promise<string> {
  try {
    // Call our API endpoint
    const response = await fetch("/api/generate-schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formData,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Failed to generate schedule")
    }

    const data = await response.json()
    return data.schedule
  } catch (error) {
    console.error("Error generating schedule:", error)
    return generateFallbackSchedule(formData)
  }
}

function generateFallbackSchedule(formData: TripFormData): string {
  // This is a fallback implementation that returns a sample schedule
  // In case the AI model call fails

  const { destination, duration, tripType, scheduleStyle, activities } = formData

  let schedule = `<h2>Your ${scheduleStyle.charAt(0).toUpperCase() + scheduleStyle.slice(1)} Schedule for ${destination}</h2>`

  schedule += `<p>Here's your personalized ${tripType} itinerary for ${duration} in ${destination}:</p>`

  // Generate a sample daily schedule
  schedule += `<h3>Daily Overview</h3>`
  schedule += `<ul>`

  if (tripType === "work" || tripType === "hybrid") {
    schedule += `<li><strong>Morning:</strong> Productive work sessions at recommended coworking spaces</li>`
  }

  if (tripType === "leisure" || tripType === "hybrid") {
    const sampleActivities = activities.slice(0, 3).join(", ") || "local attractions"
    schedule += `<li><strong>Afternoon:</strong> Explore ${sampleActivities}</li>`
  }

  schedule += `<li><strong>Evening:</strong> Dinner at local restaurants with cultural experiences</li>`
  schedule += `</ul>`

  // Add a sample detailed day
  schedule += `<h3>Day 1 - Getting Oriented</h3>`
  schedule += `<ul>`
  schedule += `<li><strong>8:00 AM:</strong> Breakfast at hotel</li>`

  if (tripType === "work" || tripType === "hybrid") {
    schedule += `<li><strong>9:00 AM - 12:00 PM:</strong> Work session at recommended coworking space</li>`
    schedule += `<li><strong>12:00 PM:</strong> Lunch break at nearby café</li>`
    schedule += `<li><strong>1:00 PM - 3:00 PM:</strong> Team call or focused work time</li>`
  }

  if (tripType === "leisure" || tripType === "hybrid") {
    const timeStart = tripType === "hybrid" ? "3:30 PM" : "9:30 AM"
    schedule += `<li><strong>${timeStart} - 6:00 PM:</strong> Explore ${activities[0] || "local attractions"}</li>`
  }

  schedule += `<li><strong>7:00 PM:</strong> Dinner at recommended local restaurant</li>`
  schedule += `<li><strong>9:00 PM:</strong> Evening stroll or relaxation time</li>`
  schedule += `</ul>`

  // Add a note about the schedule being customizable
  schedule += `<p><em>This schedule is fully customizable. You can adjust any activity or timing by using the "Edit Plan" button or by typing specific instructions in the chat box.</em></p>`

  return schedule
}


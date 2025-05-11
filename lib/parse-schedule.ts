export interface ScheduleEvent {
  date: string // ISO date string (YYYY-MM-DD)
  time: string // Display time (e.g., "9:00 AM")
  title: string
  description?: string
  type: "work" | "leisure" | "other"
}

export function parseScheduleToEvents(scheduleHtml: string): ScheduleEvent[] {
  // This is a simplified parser that extracts events from the HTML schedule
  // In a real implementation, this would be more robust

  const events: ScheduleEvent[] = []

  try {
    // Clean up the HTML if it contains markdown code blocks
    const cleanHtml = scheduleHtml.replace(/```html|```/g, "").trim()

    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(cleanHtml, "text/html")

    // Find day headings (h3 elements that start with "Day")
    const dayHeadings = Array.from(doc.querySelectorAll("h3")).filter((h3) =>
      h3.textContent?.trim().toLowerCase().includes("day"),
    )

    // If no day headings found, try to find any list items with times
    if (dayHeadings.length === 0) {
      const listItems = Array.from(doc.querySelectorAll("li"))
      const startDate = new Date()

      listItems.forEach((item, index) => {
        const text = item.textContent || ""
        const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i)

        if (timeMatch) {
          const time = timeMatch[0]
          const title = text
            .replace(time, "")
            .replace(/^[:\s-]+/, "")
            .trim()

          // Determine event type based on keywords
          let type: "work" | "leisure" | "other" = "other"

          if (/work|meeting|call|conference|coworking/i.test(title)) {
            type = "work"
          } else if (/tour|visit|explore|museum|park|restaurant|cafe|shopping/i.test(title)) {
            type = "leisure"
          }

          // Assign to today or distribute across the week
          const dayOffset = Math.floor(index / 5) // Roughly 5 events per day
          const eventDate = new Date(startDate)
          eventDate.setDate(startDate.getDate() + dayOffset)
          const dateString = eventDate.toISOString().split("T")[0]

          events.push({
            date: dateString,
            time,
            title,
            type,
          })
        }
      })

      return events
    }

    // Start date is today
    const startDate = new Date()

    // Process each day
    dayHeadings.forEach((heading, dayIndex) => {
      const dayDate = new Date(startDate)
      dayDate.setDate(startDate.getDate() + dayIndex)
      const dateString = dayDate.toISOString().split("T")[0]

      // Find the list items that follow this heading
      let listItems: Element[] = []
      let element = heading.nextElementSibling

      while (element && element.tagName !== "H3") {
        if (element.tagName === "UL" || element.tagName === "OL") {
          listItems = Array.from(element.querySelectorAll("li"))
          break
        } else if (element.querySelectorAll("li").length > 0) {
          // Sometimes the list might be nested in another element
          listItems = Array.from(element.querySelectorAll("li"))
          break
        }
        element = element.nextElementSibling
      }

      // If no list items found directly, look for any list items after this heading and before the next heading
      if (listItems.length === 0) {
        const allListItems = Array.from(doc.querySelectorAll("li"))
        const nextHeadingIndex = dayHeadings.indexOf(heading) + 1
        const nextHeading = nextHeadingIndex < dayHeadings.length ? dayHeadings[nextHeadingIndex] : null

        if (nextHeading) {
          // Get all list items between this heading and the next
          listItems = allListItems.filter((item) => {
            const itemPosition = item.compareDocumentPosition(heading)
            const nextHeadingPosition = nextHeading ? item.compareDocumentPosition(nextHeading) : 0

            // Check if item is after current heading and before next heading
            return (
              itemPosition & Node.DOCUMENT_POSITION_PRECEDING &&
              (!nextHeading || nextHeadingPosition & Node.DOCUMENT_POSITION_FOLLOWING)
            )
          })
        } else {
          // Get all list items after this heading
          listItems = allListItems.filter((item) => {
            const itemPosition = item.compareDocumentPosition(heading)
            return itemPosition & Node.DOCUMENT_POSITION_PRECEDING
          })
        }
      }

      // Process each list item as an event
      listItems.forEach((item) => {
        const text = item.textContent || ""

        // Try to extract time and title
        const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i)

        if (timeMatch) {
          const time = timeMatch[0]
          const title = text
            .replace(time, "")
            .replace(/^[:\s-]+/, "")
            .trim()

          // Determine event type based on keywords
          let type: "work" | "leisure" | "other" = "other"

          if (/work|meeting|call|conference|coworking/i.test(title)) {
            type = "work"
          } else if (/tour|visit|explore|museum|park|restaurant|cafe|shopping/i.test(title)) {
            type = "leisure"
          }

          events.push({
            date: dateString,
            time,
            title,
            type,
          })
        }
      })
    })

    // If we still have no events, create some dummy events
    if (events.length === 0) {
      // Assuming formData is passed as an argument to the function or is available in the scope
      const formData = { destination: "your destination", tripType: "hybrid" } // Provide default values or fetch from context
      const dummyEvents = createDummyEvents(startDate, formData.destination, formData.tripType)
      events.push(...dummyEvents)
    }

    return events
  } catch (error) {
    console.error("Error parsing schedule:", error)
    // Return some dummy events if parsing fails
    return createDummyEvents(new Date(), "your destination", "hybrid")
  }
}

// Helper function to create dummy events if parsing fails
function createDummyEvents(startDate: Date, destination: string, tripType = "hybrid"): ScheduleEvent[] {
  const events: ScheduleEvent[] = []

  // Create events for 3 days
  for (let day = 0; day < 3; day++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + day)
    const dateString = currentDate.toISOString().split("T")[0]

    // Morning events
    events.push({
      date: dateString,
      time: "8:00 AM",
      title: "Breakfast at hotel",
      type: "other",
    })

    if (tripType === "work" || tripType === "hybrid") {
      events.push({
        date: dateString,
        time: "9:00 AM",
        title: "Work session at coworking space",
        type: "work",
      })

      events.push({
        date: dateString,
        time: "12:00 PM",
        title: "Lunch break",
        type: "other",
      })
    }

    if (tripType === "leisure" || tripType === "hybrid") {
      const leisureTime = tripType === "hybrid" ? "2:00 PM" : "10:00 AM"
      events.push({
        date: dateString,
        time: leisureTime,
        title: `Explore ${destination}`,
        type: "leisure",
      })
    }

    // Evening event
    events.push({
      date: dateString,
      time: "7:00 PM",
      title: "Dinner at local restaurant",
      type: "leisure",
    })
  }

  return events
}


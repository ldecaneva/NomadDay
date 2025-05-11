import type { ScheduleEvent } from "./parse-schedule"

export function generateGoogleCalendarUrl(events: ScheduleEvent[], title: string): string {
  // Base URL for Google Calendar
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE"

  // Create a URL for each event
  const eventUrls = events.map((event) => {
    // Parse the date and time
    const [year, month, day] = event.date.split("-").map(Number)

    // Parse the time (assuming format like "9:00 AM")
    const [time, period] = event.time.split(" ")
    let [hours, minutes] = time.split(":").map(Number)

    // Convert to 24-hour format
    if (period?.toUpperCase() === "PM" && hours < 12) {
      hours += 12
    } else if (period?.toUpperCase() === "AM" && hours === 12) {
      hours = 0
    }

    // Create start and end dates (assuming 1 hour duration)
    const startDate = new Date(year, month - 1, day, hours, minutes)
    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 1)

    // Format dates for Google Calendar URL
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "")
    }

    const start = formatDate(startDate)
    const end = formatDate(endDate)

    // Create the URL parameters
    const params = new URLSearchParams({
      text: event.title,
      dates: `${start}/${end}`,
      details: `Event from TuxTime itinerary: ${title}`,
      location: "",
    })

    return `${baseUrl}&${params.toString()}`
  })

  return eventUrls[0] || ""
}

export function exportToGoogleCalendar(events: ScheduleEvent[], title: string): void {
  // Get the URL for the first event
  const url = generateGoogleCalendarUrl(events, title)

  // Open the URL in a new tab
  if (url) {
    window.open(url, "_blank")
  }
}


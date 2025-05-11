"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Briefcase, Coffee, Clock } from "lucide-react"
import { parseScheduleToEvents } from "@/lib/parse-schedule"

interface CalendarViewProps {
  scheduleHtml: string
  destination: string
  duration: string
}

export function CalendarView({ scheduleHtml, destination, duration }: CalendarViewProps) {
  const events = parseScheduleToEvents(scheduleHtml)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // Figure out date range for the week view
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  // Quick helper for date formatting
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Week navigation controls
  const previousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // Filter events that match the selected day
  const getEventsForDay = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateString)
  }

  // Build array of dates for the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    return day
  })

  // Pick the right icon based on event category
  const getEventIcon = (type: string) => {
    switch (type) {
      case "work":
        return <Briefcase className="h-3 w-3 mr-1" />
      case "leisure":
        return <Coffee className="h-3 w-3 mr-1" />
      default:
        return <Clock className="h-3 w-3 mr-1" />
    }
  }

  // Style events differently by type
  const getEventColor = (type: string) => {
    switch (type) {
      case "work":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "leisure":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={previousWeek} className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium bg-gray-100 px-4 py-1 rounded-full">
          {formatDate(startOfWeek)} - {formatDate(endOfWeek)}
        </span>
        <Button variant="outline" size="sm" onClick={nextWeek} className="rounded-full">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <div key={day} className="text-center font-medium p-2 text-sm text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar cells */}
        {weekDays.map((date, i) => {
          const dayEvents = getEventsForDay(date)
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div
              key={i}
              className={`min-h-[140px] rounded-xl p-2 ${
                isToday ? "bg-primary/5 ring-1 ring-primary" : "bg-gray-50 hover:bg-gray-100 transition-colors"
              }`}
            >
              <div className={`text-center mb-2 ${isToday ? "font-bold" : ""}`}>
                <span
                  className={`inline-block rounded-full w-7 h-7 leading-7 ${isToday ? "bg-primary text-white" : ""}`}
                >
                  {date.getDate()}
                </span>
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[100px] pr-1">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event, j) => (
                    <div
                      key={j}
                      className={`text-xs p-1.5 rounded-lg border ${getEventColor(event.type)} flex items-center`}
                      title={`${event.time}: ${event.title}`}
                    >
                      {getEventIcon(event.type)}
                      <div className="truncate">
                        <span className="font-medium">{event.time}</span>: {event.title}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 italic text-center py-2">No events</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


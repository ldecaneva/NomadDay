"use client"

import { useState } from "react"
import { useFormContext } from "@/lib/form-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Edit,
  FileText,
  Calendar,
  Download,
  ArrowLeft,
  Send,
  Loader2,
  MessageSquare,
  Sparkles,
  MapPin,
} from "lucide-react"
import { CalendarView } from "../calendar-view"
import { parseScheduleToEvents } from "@/lib/parse-schedule"
import { exportToGoogleCalendar } from "@/lib/google-calendar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookingContainer } from "../booking/booking-container"
import { Badge } from "@/components/ui/badge"

interface GeneratedScheduleProps {
  onBack?: () => void
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export function GeneratedSchedule({ onBack }: GeneratedScheduleProps) {
  const { generatedSchedule, setGeneratedSchedule, formData } = useFormContext()
  const [activeTab, setActiveTab] = useState("text")
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBookingOptions, setShowBookingOptions] = useState(false)
  const [updatedSchedule, setUpdatedSchedule] = useState<string | null>(null)

  if (!generatedSchedule) return null

  // Prefer updated version if available
  const scheduleToDisplay = () => {
    return updatedSchedule ? updatedSchedule : generatedSchedule
  }

  const events = parseScheduleToEvents(scheduleToDisplay())

  const handleExportToGoogleCalendar = () => {
    exportToGoogleCalendar(events, `TuxTime Trip to ${formData.destination}`)
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    setChatInput("")

    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])

    setIsLoading(true)
    setError(null)

    try {
      // Call our API to get a response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          schedule: scheduleToDisplay(),
          formData,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to get response")
      }

      const data = await response.json()

      // Add assistant message
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.response }])

      // Check if the response contains an updated schedule
      if (data.updatedSchedule) {
        setUpdatedSchedule(data.updatedSchedule)
        // Switch to text tab to show the updated schedule
        setActiveTab("text")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response")
    } finally {
      setIsLoading(false)
    }
  }

  // Process the HTML to ensure it's properly formatted
  const processedSchedule = scheduleToDisplay().replace(/```html|```/g, "").trim()

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mb-4 rounded-full">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      )}

      <Card className="w-full overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">Your TuxTime Schedule</CardTitle>
                <Badge variant="outline" className="bg-white">
                  <Sparkles className="h-3 w-3 text-yellow-500 mr-1" /> AI Generated
                </Badge>
              </div>
              <CardDescription className="mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {formData.destination} • {formData.duration}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setGeneratedSchedule(null)} className="rounded-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100 rounded-none">
              <TabsTrigger
                value="text"
                className="rounded-full flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary"
              >
                <FileText className="h-4 w-4" /> Text View
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="rounded-full flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary"
              >
                <Calendar className="h-4 w-4" /> Calendar View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl">
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">Schedule Style:</span>
                  </div>
                  <Badge variant="outline" className="capitalize bg-white">
                    {formData.scheduleStyle}
                  </Badge>
                </div>

                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: processedSchedule }} className="schedule-content" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="p-6">
              <CalendarView
                scheduleHtml={processedSchedule}
                destination={formData.destination}
                duration={formData.duration}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between p-4 border-t">
          <Button variant="outline" onClick={() => setGeneratedSchedule(null)} className="rounded-full">
            <Edit className="h-4 w-4 mr-2" />
            Edit Plan
          </Button>
          <Button variant="outline" onClick={() => setShowBookingOptions(!showBookingOptions)} className="rounded-full">
            {showBookingOptions ? "Hide Booking Options" : "Show Booking Options"}
          </Button>
          <Button onClick={handleExportToGoogleCalendar} className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Export to Calendar
          </Button>
        </CardFooter>
      </Card>

      {showBookingOptions && <BookingContainer />}

      <Card className="w-full overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Chat with Tux
          </CardTitle>
          <CardDescription>Need to make adjustments? Chat with Tux to refine your schedule</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4 rounded-xl">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {chatMessages.length > 0 && (
            <div className="mb-4 space-y-4 max-h-[300px] overflow-y-auto p-2">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-gray-100"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div dangerouslySetInnerHTML={{ __html: message.content }} />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="e.g., 'Move tomorrow's lunch to 1 PM' or 'Add a museum visit'"
              className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !chatInput.trim()} className="rounded-full">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


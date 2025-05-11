"use client"

import { useState } from "react"
import { useFormContext } from "@/context/form-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, Check, Calendar, MessageSquare, Edit } from "lucide-react"

export function ResultStep() {
  const { formData, resetForm } = useFormContext()
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("prompt")
  const [editablePrompt, setEditablePrompt] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [generatedSchedule, setGeneratedSchedule] = useState("")

  // Build a structured prompt based on user selections
  const generatePrompt = () => {
    const selectedActivities = formData.activities
      .filter((a) => a.selected)
      .map((a) => a.name)
      .join(", ")

    const colleagueInfo =
      formData.colleagues.length > 0
        ? formData.colleagues.map((c) => `${c.email || "Colleague"} (${c.timezone || "Unknown timezone"})`).join(", ")
        : "No colleagues to coordinate with"

    return `Create a detailed ${formData.tripType} trip itinerary for ${formData.destination} with the following parameters:

Duration: ${formData.duration}
Budget: ${formData.budget}
Trip Type: ${formData.tripType.charAt(0).toUpperCase() + formData.tripType.slice(1)}
Schedule Style: ${formData.scheduleStyle.charAt(0).toUpperCase() + formData.scheduleStyle.slice(1)}

Activities of Interest: ${selectedActivities || "No specific activities selected"}

Personal Preferences:
${formData.preferences || "No specific preferences provided"}

Colleague Coordination:
${colleagueInfo}

${formData.bookMissingComponents ? "Please suggest appropriate travel components (hotels, transportation) within the budget." : "No need to suggest travel components."}

Format the response as a detailed day-by-day itinerary with specific times, locations, and estimated costs. Include work-specific recommendations for quiet spaces or co-working locations if this is a work or hybrid trip. Optimize meeting times across timezones if colleagues are specified.`
  }

  const prompt = generatePrompt()

  // Mock implementation - in production this would hit OpenAI API
  const generateSchedule = async () => {
    setLoading(true)
    setActiveTab("schedule")

    // Just a placeholder until API integration is complete
    // Simulating network delay with timeout
    setTimeout(() => {
      setGeneratedSchedule(`# ${formData.tripType.toUpperCase()} TRIP TO ${formData.destination.toUpperCase()}

## Day 1
- 08:00 AM: Breakfast at local café ($15)
- 10:00 AM: Visit main attractions in ${formData.destination} ($25)
- 12:30 PM: Lunch at recommended restaurant ($20)
- 02:00 PM: Work session at "Digital Nomad Café" - quiet space with fast WiFi
- 05:00 PM: Evening leisure activity
- 07:30 PM: Dinner ($30)

## Day 2
- 09:00 AM: Morning activity based on preferences
- 11:00 AM: Meeting with colleagues (optimized for ${formData.colleagues[0]?.timezone || "local"} timezone)
- 01:00 PM: Lunch ($20)
- 03:00 PM: Afternoon exploration
- 06:00 PM: Free time
- 08:00 PM: Dinner at local hotspot ($35)

## Additional Recommendations
- Recommended workspace: CoWork ${formData.destination} ($20/day)
- Local transportation options: Subway pass ($10/day)
${formData.bookMissingComponents ? "- Suggested hotel: Boutique Hotel Central ($120/night)" : ""}

Total estimated daily cost: $100-150 (within your budget of ${formData.budget})`)
      setLoading(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(isEditing ? editablePrompt : prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEdit = () => {
    if (!isEditing) {
      setEditablePrompt(prompt)
    }
    setIsEditing(!isEditing)
  }

  const startOver = () => {
    resetForm()
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Prompt
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Prompt for ChatGPT</CardTitle>
              <CardDescription>
                This structured prompt will help ChatGPT generate a consistent and detailed schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editablePrompt}
                  onChange={(e) => setEditablePrompt(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              ) : (
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm">{prompt}</div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleEdit}>
                {isEditing ? (
                  "Done"
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" /> Edit Prompt
                  </>
                )}
              </Button>
              <Button onClick={copyToClipboard} className="flex items-center gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Generated Schedule</CardTitle>
              <CardDescription>View your AI-generated itinerary based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Generating your personalized schedule...</p>
                </div>
              ) : generatedSchedule ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: generatedSchedule }} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4">Click the button below to generate your schedule</p>
                  <Button onClick={generateSchedule}>Generate Schedule</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={startOver}>
          Start Over
        </Button>
        {activeTab === "prompt" && (
          <Button onClick={generateSchedule} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Schedule"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}


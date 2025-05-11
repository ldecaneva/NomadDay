"use client"

import { useState } from "react"
import { useFormContext } from "@/lib/form-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { generateSchedule } from "@/lib/generate-schedule"
import { Loader2, AlertCircle, MessageSquare, Sparkles, Lightbulb } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function FreeTextPromptStep() {
  const { formData, updateFormData, setGeneratedSchedule } = useFormContext()
  const [freeTextPrompt, setFreeTextPrompt] = useState(formData.freeTextPrompt || "")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    updateFormData({ freeTextPrompt })
    setError(null)

    // Generate the schedule
    setIsGenerating(true)
    try {
      const schedule = await generateSchedule({
        ...formData,
        freeTextPrompt,
      })
      setGeneratedSchedule(schedule)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate schedule")
    } finally {
      setIsGenerating(false)
    }
  }

  // Start creating the itinerary
  const handleGenerateSchedule = () => {
    if (freeTextPrompt.trim()) {
      setIsGenerating(true)
      // ... existing code ...
    }
  }

  // Inspiration for users who need ideas
  const examplePrompts = [
    "A solo work trip to Tokyo with meetings during business hours and exploration in the evenings",
    "Family vacation in Barcelona with kid-friendly activities and some remote work time",
    "Anniversary trip to Paris with romantic dinners and sightseeing during the day",
    "Weekend getaway to New York with Broadway shows and museum visits",
  ]

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Customize Your Trip
          </CardTitle>
          <div className="bg-primary/10 rounded-full px-2 py-1 text-xs font-medium text-primary flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> AI Powered
          </div>
        </div>
        <CardDescription>Add any additional details or special requests for your trip</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Textarea
            placeholder="Tell us more about your trip preferences, hidden gems you'd like to discover, or any special requirements..."
            value={freeTextPrompt}
            onChange={(e) => setFreeTextPrompt(e.target.value)}
            className="min-h-[150px] text-base rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
          />

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-yellow-500" /> Prompt Ideas:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {examplePrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-2 text-sm cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={() => setFreeTextPrompt((prev) => (prev ? `${prev}\n${prompt}` : prompt))}
                >
                  "{prompt}"
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="w-full flex justify-between">
          <Button variant="outline" onClick={() => updateFormData({ currentStep: 4 })} className="rounded-full">
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isGenerating} className="rounded-full">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create My Plan
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}


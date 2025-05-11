"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TuxTimeHeader } from "./tux-time-header"
import { CalendarView } from "./calendar-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Calendar, List, Search, MapPin, CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// Sample data for demonstration
const sampleTrips = [
  {
    id: "1",
    destination: "Tokyo, Japan",
    duration: "7 days",
    startDate: "2023-10-15",
    tripType: "hybrid",
    scheduleHtml: `
      <h2>Your Medium Schedule for Tokyo, Japan</h2>
      <p>Here's your personalized hybrid itinerary for 7 days in Tokyo, Japan:</p>
      <h3>Daily Overview</h3>
      <ul>
        <li><strong>Morning:</strong> Productive work sessions at recommended coworking spaces</li>
        <li><strong>Afternoon:</strong> Explore local attractions</li>
        <li><strong>Evening:</strong> Dinner at local restaurants with cultural experiences</li>
      </ul>
      <h3>Day 1 - Getting Oriented</h3>
      <ul>
        <li><strong>8:00 AM:</strong> Breakfast at hotel</li>
        <li><strong>9:00 AM - 12:00 PM:</strong> Work session at recommended coworking space</li>
        <li><strong>12:00 PM:</strong> Lunch break at nearby café</li>
        <li><strong>1:00 PM - 3:00 PM:</strong> Team call or focused work time</li>
        <li><strong>3:30 PM - 6:00 PM:</strong> Explore Shibuya Crossing</li>
        <li><strong>7:00 PM:</strong> Dinner at recommended local restaurant</li>
        <li><strong>9:00 PM:</strong> Evening stroll or relaxation time</li>
      </ul>
    `,
  },
  {
    id: "2",
    destination: "Paris, France",
    duration: "5 days",
    startDate: "2023-11-20",
    tripType: "leisure",
    scheduleHtml: `
      <h2>Your Full Schedule for Paris, France</h2>
      <p>Here's your personalized leisure itinerary for 5 days in Paris, France:</p>
      <h3>Daily Overview</h3>
      <ul>
        <li><strong>Morning:</strong> Visit iconic landmarks</li>
        <li><strong>Afternoon:</strong> Explore museums and cultural sites</li>
        <li><strong>Evening:</strong> Fine dining and entertainment</li>
      </ul>
      <h3>Day 1 - Parisian Classics</h3>
      <ul>
        <li><strong>8:00 AM:</strong> Breakfast at local café</li>
        <li><strong>9:30 AM:</strong> Visit Eiffel Tower</li>
        <li><strong>12:30 PM:</strong> Lunch at bistro</li>
        <li><strong>2:00 PM:</strong> Louvre Museum tour</li>
        <li><strong>6:00 PM:</strong> Seine River cruise</li>
        <li><strong>8:00 PM:</strong> Dinner in Le Marais</li>
      </ul>
    `,
  },
]

interface DashboardProps {
  onBack?: () => void
}

export function Dashboard({ onBack }: DashboardProps) {
  const [selectedTrip, setSelectedTrip] = useState(sampleTrips[0])
  const [activeTab, setActiveTab] = useState("calendar")
  const router = useRouter()
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null)
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([])
  const [pastTrips, setPastTrips] = useState<Trip[]>([])

  useEffect(() => {
    // Dummy data until backend integration is complete
    const dummyTrips: Trip[] = [
      // ... existing code ...
    ]
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push("/")
    }
  }

  const handleNewTrip = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TuxTimeHeader />

      <main className="flex-1 container max-w-6xl py-8">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2 mb-6 rounded-full">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
                <CardTitle>My Trips</CardTitle>
                <CardDescription>View and manage your trips</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    placeholder="Search trips..."
                    className="pl-9 h-10 w-full rounded-full border border-gray-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2 mt-2">
                  {sampleTrips.map((trip) => (
                    <button
                      key={trip.id}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedTrip.id === trip.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <div className="font-medium">{trip.destination}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <CalendarDays className="h-3 w-3" /> {trip.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full rounded-full" onClick={handleNewTrip}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Trip
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card className="w-full overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedTrip.destination}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3" /> {selectedTrip.duration} •
                      <Badge variant="outline" className="capitalize bg-white">
                        {selectedTrip.tripType} Trip
                      </Badge>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleNewTrip} className="rounded-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Trip
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100 rounded-none">
                    <TabsTrigger
                      value="calendar"
                      className="rounded-full flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary"
                    >
                      <Calendar className="h-4 w-4" /> Calendar View
                    </TabsTrigger>
                    <TabsTrigger
                      value="details"
                      className="rounded-full flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary"
                    >
                      <List className="h-4 w-4" /> Trip Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="calendar" className="p-6">
                    <CalendarView
                      scheduleHtml={selectedTrip.scheduleHtml}
                      destination={selectedTrip.destination}
                      duration={selectedTrip.duration}
                    />
                  </TabsContent>

                  <TabsContent value="details" className="p-6">
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedTrip.scheduleHtml }} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between p-4 border-t">
                <Button variant="outline" className="rounded-full">
                  Edit Trip
                </Button>
                <Button className="rounded-full">Export to Calendar</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


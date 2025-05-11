"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TuxTimeHeader } from "./tux-time-header"
import { TuxTimeQuestionnaire } from "./tux-time-questionnaire"
import { CalendarClock, Globe, Briefcase, Coffee, Calendar, HelpCircle, Sparkles, ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export function LandingPage() {
  const [view, setView] = useState<"landing" | "questionnaire" | "dashboard">("landing")
  const router = useRouter()

  const handleNewTrip = () => {
    setView("questionnaire")
  }

  const handleViewDashboard = () => {
    router.push("/dashboard")
  }

  if (view === "questionnaire") {
    return <TuxTimeQuestionnaire onBack={() => setView("landing")} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TuxTimeHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-white py-16 md:py-24 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 opacity-10">
            <Image src="/images/world-map.png" alt="World Map Background" fill className="object-cover" priority />
          </div>

          <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-white flex items-center gap-2 w-fit">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">AI-Powered Travel Planning</span>
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Plan Your Perfect{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Global Journey
                  </span>
                </h1>
                <p className="text-xl text-gray-600">
                  Seamlessly manage travel & time zones with minimal effort. TuxTime helps you balance work and leisure
                  for the perfect trip.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-full" onClick={handleNewTrip}>
                    <HelpCircle className="mr-2 h-5 w-5" />
                    New Trip Questionnaire
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 rounded-full"
                    onClick={handleViewDashboard}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    View Dashboard
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/travel-planning.jpg"
                  alt="TuxTime App Preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Key Features</h2>
              <p className="text-xl text-gray-600 mt-4">Everything you need for effortless travel planning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Globe className="h-10 w-10 text-primary" />}
                title="Intelligent Trip Planning"
                description="Transform disorganized travel ideas into optimized, time-zone-aware itineraries that save time and reduce hassle."
              />
              <FeatureCard
                icon={<CalendarClock className="h-10 w-10 text-primary" />}
                title="Work-Leisure Balance"
                description="Seamlessly blend work calls, in-person meetings, leisure activities, and travel logistics while integrating calendar data."
              />
              <FeatureCard
                icon={<Briefcase className="h-10 w-10 text-primary" />}
                title="Workspace Recommendations"
                description="Find the best locations for work calls by suggesting ideal workspaces, co-working hubs, or on-the-go solutions."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-primary/5 relative overflow-hidden">
          {/* Decorative image */}
          <div className="absolute right-0 top-0 w-64 h-64 opacity-10 -rotate-12 translate-x-1/4 -translate-y-1/4">
            <Image src="/images/compass.png" alt="Compass" width={256} height={256} className="object-contain" />
          </div>

          <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-xl text-gray-600 mt-4">Simple steps to your perfect itinerary</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <StepCard number="1" title="Enter Details" description="Input your destination, budget, and duration" />
              <StepCard
                number="2"
                title="Set Preferences"
                description="Choose activities and specify your work-leisure balance"
              />
              <StepCard number="3" title="Add Colleagues" description="Optimize scheduling across time zones" />
              <StepCard number="4" title="Get Your Plan" description="Receive a detailed, personalized itinerary" />
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full" onClick={handleNewTrip}>
                Start Planning Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Trip Types Section */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">For Every Type of Trip</h2>
              <p className="text-xl text-gray-600 mt-4">TuxTime adapts to your unique travel style</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TripTypeCard
                icon={<Briefcase className="h-8 w-8 text-blue-600" />}
                title="Work Trips"
                description="Optimize your business travel with perfect meeting schedules and productive workspace recommendations."
                color="blue"
              />
              <TripTypeCard
                icon={<Coffee className="h-8 w-8 text-green-600" />}
                title="Leisure Getaways"
                description="Maximize your vacation time with personalized activities and experiences tailored to your interests."
                color="green"
              />
              <TripTypeCard
                icon={
                  <div className="flex">
                    <Briefcase className="h-8 w-8 text-purple-600" />
                    <Coffee className="h-8 w-8 ml-1 text-purple-600" />
                  </div>
                }
                title="Hybrid Journeys"
                description="Balance work responsibilities with leisure activities for the perfect bleisure trip experience."
                color="purple"
              />
            </div>
          </div>
        </section>

        {/* Testimonial Section - New */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="bg-primary/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-64 h-64 opacity-10">
                <Image src="/images/map-pin.png" alt="Map Pin" width={256} height={256} className="object-contain" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
                <div>
                  <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
                    <Image src="/images/happy-traveler.jpg" alt="Happy Traveler" fill className="object-cover" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">What Our Users Say</h2>
                  <div className="text-xl italic">
                    "TuxTime transformed my business trip to Tokyo into a perfect blend of productivity and exploration.
                    The time zone management was a lifesaver!"
                  </div>
                  <div className="font-medium">— Sarah K., Digital Nomad</div>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Plan Your Perfect Trip?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let TuxTime handle the details while you focus on what matters most.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full" onClick={handleNewTrip}>
                <HelpCircle className="mr-2 h-5 w-5" />
                New Trip Questionnaire
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-full"
                onClick={handleViewDashboard}
              >
                <Calendar className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-white/10 rounded-full p-2 mr-2">
                <CalendarClock className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">TuxTime</span>
            </div>
            <div className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} TuxTime. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-primary/10 rounded-full p-4 w-fit mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TripTypeCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: "blue" | "green" | "purple"
}) {
  const bgColor = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
  }[color]

  const borderColor = {
    blue: "border-blue-200 hover:border-blue-300",
    green: "border-green-200 hover:border-green-300",
    purple: "border-purple-200 hover:border-purple-300",
  }[color]

  return (
    <div className={`border rounded-xl p-6 ${borderColor} transition-colors`}>
      <div className={`${bgColor} rounded-full p-4 w-fit mb-4`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}


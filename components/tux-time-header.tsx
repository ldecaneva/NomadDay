"use client"

import type React from "react"

import { CalendarClock, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useFormContext } from "@/lib/form-context"

export function TuxTimeHeader() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // FormContext might not be available on all pages
  let formContext: any = null
  try {
    formContext = useFormContext()
  } catch (error) {
    // Not a problem - some pages don't need form data
  }

  const handleStartNewTrip = () => {
    // Clear previous form data when starting fresh
    if (formContext) {
      formContext.resetForm()
    }
    router.push("/questionnaire")
  }

  // Go to main page
  const handleBackHome = () => {
    router.push("/")
  }

  // Show trips list page
  const handleViewTrips = () => {
    router.push("/dashboard")
  }

  // Account management not implemented yet
  const handleAccountAction = () => {
    window.alert("Account management coming soon!")
  }

  const handleHelpClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // For now, just show an alert
    alert("Help functionality will be available soon!")
  }

  return (
    <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="container max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={handleBackHome}>
          <div className="bg-primary/10 rounded-full p-2">
            <CalendarClock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            TuxTime
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors" onClick={handleBackHome}>
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-primary transition-colors"
              onClick={handleViewTrips}
            >
              My Trips
            </Link>
            <Link href="#" className="text-gray-600 hover:text-primary transition-colors" onClick={handleHelpClick}>
              Help
            </Link>
          </nav>
          <Button className="rounded-full" onClick={handleStartNewTrip}>
            New Trip
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-500 hover:text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-md py-4 px-6 z-50">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary transition-colors py-2"
              onClick={(e) => {
                handleBackHome()
                setMobileMenuOpen(false)
              }}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-primary transition-colors py-2"
              onClick={(e) => {
                handleViewTrips()
                setMobileMenuOpen(false)
              }}
            >
              My Trips
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-primary transition-colors py-2"
              onClick={(e) => {
                handleHelpClick(e)
                setMobileMenuOpen(false)
              }}
            >
              Help
            </Link>
            <Button
              className="rounded-full w-full"
              onClick={() => {
                handleStartNewTrip()
                setMobileMenuOpen(false)
              }}
            >
              New Trip
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}


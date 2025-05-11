// Mock data types
export interface FlightOption {
  id: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  currency: string
  logo: string
  bookingUrl: string
  stops: number
}

export interface HotelOption {
  id: string
  name: string
  location: string
  stars: number
  price: number
  currency: string
  perNight: boolean
  image: string
  amenities: string[]
  bookingUrl: string
  rating: number
  reviewCount: number
}

// Update the SearchParams interface to include arrival location
export interface SearchParams {
  destination: string
  departureLocation?: string
  arrivalLocation?: string // Add this for the arrival airport
  startDate?: string // YYYY-MM-DD format
  endDate?: string // YYYY-MM-DD format
  adults?: number
  budget?: string
}

// Make sure all flight objects have a currency property
export async function searchFlights(params: SearchParams): Promise<FlightOption[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Use the departure and arrival locations from params
  const departure = params.departureLocation || "SFO"
  const arrival = params.arrivalLocation || params.destination.substring(0, 3).toUpperCase()

  // Return mock data with more realistic airline logos
  return [
    {
      id: "f1",
      airline: "Delta Airlines",
      departureAirport: departure,
      arrivalAirport: arrival,
      departureTime: "08:30 AM",
      arrivalTime: "12:45 PM",
      duration: "11h 15m",
      price: 850,
      currency: "USD", // Ensure currency is defined
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Delta-Air-Lines-Logo.png",
      bookingUrl: "https://www.delta.com",
      stops: 0,
    },
    {
      id: "f2",
      airline: "United Airlines",
      departureAirport: departure,
      arrivalAirport: arrival,
      departureTime: "11:20 AM",
      arrivalTime: "4:35 PM",
      duration: "12h 15m",
      price: 780,
      currency: "USD", // Ensure currency is defined
      logo: "https://logos-world.net/wp-content/uploads/2021/08/United-Airlines-Logo.png",
      bookingUrl: "https://www.united.com",
      stops: 1,
    },
    {
      id: "f3",
      airline: "Japan Airlines",
      departureAirport: departure,
      arrivalAirport: arrival,
      departureTime: "1:15 PM",
      arrivalTime: "6:30 PM",
      duration: "10h 15m",
      price: 920,
      currency: "USD", // Ensure currency is defined
      logo: "https://logos-world.net/wp-content/uploads/2021/08/Japan-Airlines-Logo.png",
      bookingUrl: "https://www.jal.com",
      stops: 0,
    },
    {
      id: "f4",
      airline: "Air France",
      departureAirport: departure,
      arrivalAirport: arrival,
      departureTime: "7:45 PM",
      arrivalTime: "10:15 AM",
      duration: "13h 30m",
      price: 710,
      currency: "USD", // Ensure currency is defined
      logo: "https://logos-world.net/wp-content/uploads/2021/08/Air-France-Logo.png",
      bookingUrl: "https://www.airfrance.com",
      stops: 1,
    },
  ]
}


"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, AlertCircle, User, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { getArtistById, getServiceById } from "@/api/controller"
import Service, { Artist } from "@/lib/types"
import { formatDuration } from "@/lib/utils"

export default function ContactDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  
  // Validation state
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }>({})
  
  // Booking data from URL
  const [bookingData, setBookingData] = useState<{
    artistId: string | null
    serviceId: string | null
    date: string | null
    time: string | null
  }>({
    artistId: null,
    serviceId: null,
    date: null,
    time: null
  })
  
  // Fetched data
  const [artist, setArtist] = useState<Artist | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Extract booking data from URL parameters
  useEffect(() => {
    const artistId = searchParams.get("artistId")
    const serviceId = searchParams.get("serviceId")
    const date = searchParams.get("date")
    const time = searchParams.get("time")
    
    // Validate required parameters
    if (!artistId || !serviceId || !date || !time) {
      setError("Missing booking information. Please return to the booking page.")
      setIsLoading(false)
      return
    }
    
    setBookingData({
      artistId,
      serviceId,
      date,
      time
    })
    
    // Fetch artist and service details
    const fetchDetails = async () => {
      try {
        const [artistData, serviceData] = await Promise.all([
          getArtistById(artistId),
          getServiceById(serviceId)
        ])
        
        if (!artistData || !serviceData) {
          throw new Error("Could not retrieve booking details")
        }
        
        setArtist(artistData)
        setService(serviceData)
      } catch (err) {
        console.error("Error fetching booking details:", err)
        setError("Failed to load booking details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDetails()
  }, [searchParams])
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    
    try {
      const [year, month, day] = dateString.split("-").map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    } catch (err) {
      console.error("Error formatting date:", err)
      return dateString
    }
  }
  
  // Validate form
  const validateForm = () => {
    const newErrors: {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
    } = {}
    
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[0-9()\-\s+]+$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle going back to booking page
  const handleBack = () => {
    router.back()
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Create URL parameters with all data
    const params = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(bookingData).filter(([_, v]) => v !== null) as [string, string][]
      ),
      firstName,
      lastName,
      email,
      phone,
      notes: notes || ""
    })
    
    // Navigate to review page with parameters
    router.push(`/book-now/review?${params.toString()}`)
  }
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute w-full h-full object-cover"
        style={{ filter: "brightness(0.9)" }}
      >
        <source src="/sky.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-6">
        <div className="bg-pink-50/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl md:text-4xl font-bold text-center tracking-tight mb-2 text-pink-900">
              Contact Details
            </h1>
            <p className="text-center text-pink-400 mb-8">
              Please provide your contact information to complete your booking
            </p>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : !error ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Contact Form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-pink-900">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={`border-pink-200 focus:ring-pink-500 ${
                            errors.firstName ? "border-red-500" : ""
                          }`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-pink-900">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={`border-pink-200 focus:ring-pink-500 ${
                            errors.lastName ? "border-red-500" : ""
                          }`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-pink-900">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`border-pink-200 focus:ring-pink-500 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-pink-900">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`border-pink-200 focus:ring-pink-500 ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-pink-900">
                        Special Requests or Notes
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="border-pink-200 focus:ring-pink-500 min-h-[120px]"
                        placeholder="Any special requests or information you'd like us to know"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="border-pink-200 text-pink-900 hover:bg-pink-100"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      
                      <Button 
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                      >
                        Continue to Review
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
                
                {/* Right Column - Booking Summary */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-pink-900">Booking Summary</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-pink-900">Artist</p>
                          <p className="text-pink-700">{artist?.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-pink-900">Service</p>
                          <p className="text-pink-700">{service?.title}</p>
                          <p className="text-sm text-pink-400">{formatDuration(service?.duration || 0)}</p>
                          <p className="font-medium text-pink-900 mt-1">${service?.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-pink-900">Date</p>
                          <p className="text-pink-700">{formatDate(bookingData.date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-pink-900">Time</p>
                          <p className="text-pink-700">{bookingData.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6 bg-white p-4 rounded-lg border border-pink-100 text-sm">
                    <p className="text-pink-900 mb-2">
                      <span className="font-medium">Note:</span>
                    </p>
                    <p className="text-pink-700">
                      Your contact information will be used to communicate with you regarding your booking so please make sure it is accurate.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, User, Home, Mail } from "lucide-react"
import Link from "next/link"

export default function BookingConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [bookingData, setBookingData] = useState({
    artistName: "",
    serviceName: "",
    date: "",
    time: "",
    price: "",
    firstName: "",
    lastName: "",
  })

  // Extract booking data from URL parameters
  useEffect(() => {
    setBookingData({
      artistName: searchParams.get("artistName") || "",
      serviceName: searchParams.get("serviceName") || "",
      date: searchParams.get("date") || "",
      time: searchParams.get("time") || "",
      price: searchParams.get("price") || "",
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
    })
  }, [searchParams])

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    try {
      const [year, month, day] = dateString.split("-").map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (err) {
      console.error("Error formatting date:", err)
      return dateString
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video autoPlay muted loop className="absolute w-full h-full object-cover" style={{ filter: "brightness(0.9)" }}>
        <source src="/sky.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto p-6">
        <div className="bg-pink-50/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 text-pink-900">Booking Confirmed!</h1>
            <p className="text-pink-700 mb-8 max-w-md mx-auto">
              Thank you for your booking, {bookingData.firstName}. We've sent a confirmation email with all the details.
            </p>

            <Card className="mb-8 text-left">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-pink-900">Booking Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-pink-900">Client</p>
                      <p className="text-pink-700">
                        {bookingData.firstName} {bookingData.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-pink-900">Artist</p>
                      <p className="text-pink-700">{bookingData.artistName}</p>
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

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-pink-900">Service</p>
                      <p className="text-pink-700">{bookingData.serviceName}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-pink-900">Confirmation</p>
                      <p className="text-pink-700">Sent to your email</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white p-6 rounded-lg mb-8">
              <h2 className="text-lg font-semibold text-pink-900 mb-3">Have Questions?</h2>
              <p className="text-pink-700 mb-4">
                If you have any questions or need to make changes to your booking, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="border-pink-200 text-pink-900 hover:bg-pink-100" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button className="bg-pink-500 hover:bg-pink-600 text-white" asChild>
                  <Link href="tel:123-456-7890">Call Us</Link>
                </Button>
              </div>
            </div>

            <Button variant="ghost" className="text-pink-900 hover:bg-pink-100" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


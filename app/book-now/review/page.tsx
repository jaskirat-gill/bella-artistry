"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  Clock,
  Calendar,
  User,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { getArtistById, getServiceById } from "@/api/controller";
import type Service from "@/lib/types";
import type { TeamMember, BookingData } from "@/lib/types";
import { useConfig } from "@/components/ConfigContextProvider";

export default function BookingReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const config = useConfig();

  const [bookingData, setBookingData] = useState<BookingData>({
    artistId: null,
    serviceId: null,
    date: null,
    time: null,
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    notes: null,
  });

  const [artist, setArtist] = useState<TeamMember | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract booking data from URL parameters
  useEffect(() => {
    const artistId = searchParams.get("artistId");
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const notes = searchParams.get("notes");

    // Validate required parameters
    if (
      !artistId ||
      !serviceId ||
      !date ||
      !time ||
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      setError(
        "Missing booking information. Please return to the booking page."
      );
      setIsLoading(false);
      return;
    }

    setBookingData({
      artistId,
      serviceId,
      date,
      time,
      firstName,
      lastName,
      email,
      phone,
      notes,
    });

    // Fetch artist and service details
    const fetchDetails = async () => {
      try {
        const [artistData, serviceData] = await Promise.all([
          getArtistById(artistId),
          getServiceById(serviceId),
        ]);

        if (!artistData || !serviceData) {
          throw new Error("Could not retrieve booking details");
        }

        setArtist(artistData);
        setService(serviceData);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [searchParams]);

  // Handle going back to contact details page
  const handleBack = () => {
    router.back();
  };

  // Handle confirming booking
  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      if(!bookingData.time) {
        throw new Error("Missing booking time");
      }
      // Adjust the time by adding 7 hours back
      const [hour, minute] = bookingData.time.split(':').map(Number);
      const date = new Date();
      date.setHours(hour + 7, minute);
      const adjustedHour = date.getHours().toString().padStart(2, '0');
      const adjustedMinute = date.getMinutes().toString().padStart(2, '0');
      const adjustedTime = `${adjustedHour}:${adjustedMinute}`;
  
      const adjustedBookingData = {
        ...bookingData,
        time: adjustedTime,
      };
  
      // In a real application, you would submit the booking to your backend here
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustedBookingData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to confirm booking");
      }
  
      try {
        await fetch("/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingData, artist, service }),
        });
  
      } catch (error) {
        console.error("Error:", error);
      }
  
      // For now, we'll just simulate a successful booking
      const confirmationParams = new URLSearchParams({
        artistName: artist?.name || "",
        serviceName: service?.title || "",
        date: adjustedBookingData.date || "",
        time: adjustedBookingData.time || "",
        price: service?.price.toString() || "",
        firstName: adjustedBookingData.firstName || "",
        lastName: adjustedBookingData.lastName || "",
      });
  
      router.push(`/book-now/confirmation?${confirmationParams.toString()}`);
    } catch (err) {
      console.error("Error confirming booking:", err);
      setError("Failed to confirm booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";

    try {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover"
        style={{ filter: "brightness(0.9)" }}
      >
        <source src="/sky.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto p-6">
        <div className="bg-pink-50/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl md:text-4xl font-bold text-center tracking-tight mb-2 text-pink-900">
              Review Your Booking
            </h1>
            <p className="text-center text-pink-400 mb-8">
              Please review your booking details before confirming
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
              <>
                <Card className="mb-8">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-pink-900">
                      Booking Details
                    </CardTitle>
                    <CardDescription>
                      Your selected service and appointment time
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
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
                        <p className="text-sm text-pink-400">
                          {formatDuration(service?.duration || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-pink-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-pink-900">Date</p>
                        <p className="text-pink-700">
                          {formatDate(bookingData.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-pink-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-pink-900">Time</p>
                        <p className="text-pink-700">{bookingData.time}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-pink-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-pink-900">
                          Contact Information
                        </p>
                        <p className="text-pink-700">
                          {bookingData.firstName} {bookingData.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-pink-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-pink-900">Email</p>
                        <p className="text-pink-700">{bookingData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-pink-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-pink-900">Phone</p>
                        <p className="text-pink-700">{bookingData.phone}</p>
                      </div>
                    </div>

                    {bookingData.notes && (
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-pink-900">
                            Special Requests/Notes
                          </p>
                          <p className="text-pink-700 whitespace-pre-line">
                            {bookingData.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="flex items-start space-x-3">
                      <CreditCard className="h-5 w-5 text-pink-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-pink-900">Price</p>
                        <p className="text-xl font-semibold text-pink-900">
                          ${service?.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-pink-400">
                          {config.paymentNote}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <Button
                    variant="outline"
                    className="border-pink-200 text-pink-900 hover:bg-pink-100"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { cn, formatDateToYYYYMMDD, formatDuration } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type Service from "@/lib/types";
import type { TeamMember } from "@/lib/types";
import { getArtists, getServices } from "@/api/controller";
import VideoBackground from "@/components/VideoBackground";

// Types
interface CalendarDate {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

// Helper functions for calendar
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const getMonthName = (month: number): string => {
  return new Date(0, month).toLocaleString("default", { month: "long" });
};

const getDayName = (year: number, month: number, day: number): string => {
  return new Date(year, month, day).toLocaleString("default", {
    weekday: "long",
  });
};

// Extracted components for better organization
const CalendarHeader = ({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
}: {
  currentMonth: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-medium text-pink-900">
      {getMonthName(currentMonth)} {currentYear}
    </h3>
    <div className="flex items-center space-x-2">
      <button
        className="p-1 rounded-full hover:bg-pink-100 text-pink-500"
        onClick={onPrevMonth}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        className="p-1 rounded-full hover:bg-pink-100 text-pink-500"
        onClick={onNextMonth}
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const TimeSlotSelector = ({
  selectedDate,
  selectedArtist,
  timeSlots,
  selectedTime,
  onTimeSelect,
  isLoading,
}: {
  selectedDate: CalendarDate | null;
  selectedArtist: TeamMember | null;
  timeSlots: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  isLoading: boolean;
}) => {
  if (!selectedDate) return null;

  if (isLoading) {
    return (
      <div className="p-6 border border-pink-200 rounded-md bg-pink-50 text-pink-500 text-center">
        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
        <p>Loading available time slots...</p>
      </div>
    );
  }

  if (!selectedArtist) {
    return (
      <div className="p-4 border border-pink-200 rounded-md bg-pink-50 text-pink-500 text-center">
        Please select an artist to see available time slots
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="p-4 border border-pink-200 rounded-md bg-pink-50 text-pink-500 text-center">
        No available time slots for this date
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {timeSlots.map((time, index) => (
        <button
          key={index}
          className={cn(
            "py-2 px-4 border rounded-md text-sm",
            selectedTime === time
              ? "bg-pink-500 text-white border-pink-500"
              : "hover:bg-pink-50 border-pink-200 text-pink-900"
          )}
          onClick={() => onTimeSelect(time)}
        >
          {time}
        </button>
      ))}
    </div>
  );
};

const BookingSummary = ({
  selectedArtist,
  selectedService,
  selectedDate,
  selectedTime,
  formatSelectedDate,
}: {
  selectedArtist: TeamMember | null;
  selectedService: Service | null;
  selectedDate: CalendarDate | null;
  selectedTime: string | null;
  formatSelectedDate: () => string;
}) => {
  const router = useRouter();

  const isBookingComplete =
    selectedArtist && selectedService && selectedDate && selectedTime;

  const handleNextClick = () => {
    if (!selectedArtist || !selectedService || !selectedDate || !selectedTime) {
      return;
    }

    // Format the date for URL parameters
    const formattedDate = `${selectedDate.year}-${selectedDate.month + 1}-${
      selectedDate.day
    }`;

    // Create URL parameters
    const params = new URLSearchParams({
      artistId: selectedArtist.id,
      serviceId: selectedService.id,
      date: formattedDate,
      time: selectedTime,
    });

    // Navigate to contact details page with parameters
    router.push(`/book-now/contact?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-pink-100 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-pink-900">
        Booking Summary
      </h2>

      {isBookingComplete ? (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-pink-900">
              {selectedService!.title}
            </h3>
            <p className="text-pink-400">with {selectedArtist!.name}</p>
            <p className="text-pink-400">{formatSelectedDate()}</p>
            <p className="text-pink-400">{selectedTime}</p>
            <div className="mt-2 pt-2 border-t border-pink-100">
              <p className="text-sm text-pink-400">
                {formatDuration(selectedService!.duration)}
              </p>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white"
            onClick={handleNextClick}
          >
            Next
          </Button>
        </div>
      ) : (
        <p className="text-pink-400 italic">
          Please select an artist, service, date and time to see your booking
          summary
        </p>
      )}
    </div>
  );
};

export default function BookingPage() {
  // Current date for reference
  const today = new Date();

  // State for calendar navigation
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // State for selections
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<TeamMember | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDate[]>([]);

  // Data state
  const [services, setServices] = useState<Service[]>([]);
  const [artists, setArtists] = useState<TeamMember[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [servicesData, artistsData] = await Promise.all([
          getServices(),
          getArtists(),
        ]);

        setServices(servicesData);
        setArtists(artistsData);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(
          "Failed to load services and artists. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch time slots when date or artist changes
  useEffect(() => {
    if (!selectedDate || !selectedArtist) {
      setTimeSlots([]);
      return;
    }

    const fetchTimeSlots = async () => {
      setIsLoadingTimeSlots(true);
      setError(null);

      try {
        const formattedDate = formatDateToYYYYMMDD(selectedDate);
        const response = await fetch(
          `/api/calendar/fetch?calendarId=${selectedArtist.calendarId}&date=${formattedDate}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch time slots");
        }

        // // Subtract 7 hours from each time slot
        // const adjustedTimeSlots = data.timeSlots.map((time: string) => {
        //   const [hour, minute] = time.split(":").map(Number);
        //   const date = new Date();
        //   date.setHours(hour - 7, minute);
        //   const adjustedHour = date.getHours().toString().padStart(2, "0");
        //   const adjustedMinute = date.getMinutes().toString().padStart(2, "0");
        //   return `${adjustedHour}:${adjustedMinute}`;
        // });

        setTimeSlots(data.timeSlots);
      } catch (err) {
        console.error("Error fetching time slots:", err);
        setError(
          "Failed to load available time slots. Please try again later."
        );
        setTimeSlots([]);
      } finally {
        setIsLoadingTimeSlots(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, selectedArtist]);

  // Generate calendar days
  useEffect(() => {
    const generateCalendarDays = () => {
      const days: CalendarDate[] = [];
      const daysInMonth = getDaysInMonth(currentYear, currentMonth);
      const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

      // Previous month days
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({
          day: daysInPrevMonth - i,
          month: prevMonth,
          year: prevMonthYear,
          isCurrentMonth: false,
        });
      }

      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          day: i,
          month: currentMonth,
          year: currentYear,
          isCurrentMonth: true,
        });
      }

      // Next month days
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const remainingDays = 42 - days.length; // 6 rows of 7 days

      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          day: i,
          month: nextMonth,
          year: nextMonthYear,
          isCurrentMonth: false,
        });
      }

      return days;
    };

    setCalendarDays(generateCalendarDays());
  }, [currentMonth, currentYear]);

  // Navigate to previous month
  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  }, [currentMonth]);

  // Navigate to next month
  const goToNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  }, [currentMonth]);

  // Handle date selection
  const handleDateSelect = useCallback((date: CalendarDate) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  }, []);

  // Handle time selection
  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  // Format date for display
  const formatSelectedDate = useCallback(() => {
    if (!selectedDate) return "";

    try {
      const dayName = getDayName(
        selectedDate.year,
        selectedDate.month,
        selectedDate.day
      );
      const monthName = getMonthName(selectedDate.month);
      return `${dayName}, ${selectedDate.day} ${monthName} ${selectedDate.year}`;
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  }, [selectedDate]);

  // Handle artist selection
  const handleArtistSelect = useCallback(
    (value: string) => {
      const artist = artists.find((artist) => artist.id === value) || null;
      setSelectedArtist(artist);
      setSelectedTime(null); // Reset time when artist changes
    },
    [artists]
  );

  // Handle service selection
  const handleServiceSelect = useCallback(
    (value: string) => {
      const service = services.find((service) => service.id === value) || null;
      setSelectedService(service);
    },
    [services]
  );

  // Memoize the calendar days to prevent unnecessary re-renders
  const renderedCalendarDays = useMemo(() => {
    return calendarDays.map((date, index) => {
      const isSelected =
        selectedDate &&
        selectedDate.day === date.day &&
        selectedDate.month === date.month &&
        selectedDate.year === date.year;

      // Check if date is today
      const isToday =
        date.day === today.getDate() &&
        date.month === today.getMonth() &&
        date.year === today.getFullYear();

      return (
        <button
          key={index}
          className={cn(
            "h-10 w-10 rounded-full mx-auto flex items-center justify-center text-sm relative",
            !date.isCurrentMonth
              ? "text-pink-300 cursor-not-allowed"
              : "hover:bg-pink-100 text-pink-900",
            isSelected ? "bg-pink-500 text-white hover:bg-pink-600" : "",
            isToday && !isSelected ? "font-bold" : ""
          )}
          disabled={!date.isCurrentMonth}
          onClick={() => handleDateSelect(date)}
          aria-label={`${date.day} ${getMonthName(date.month)} ${date.year}`}
          aria-pressed={isSelected ? "true" : "false"}
        >
          {date.day}
          {isToday && !isSelected && (
            <div
              className="absolute bottom-1 w-1 h-1 bg-pink-500 rounded-full"
              aria-hidden="true"
            ></div>
          )}
        </button>
      );
    });
  }, [calendarDays, selectedDate, today, handleDateSelect]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}

      <VideoBackground
        className="absolute w-full h-full object-cover"
        style={{ filter: "brightness(0.9)" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto p-6">
        <div className="bg-pink-50/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl md:text-4xl font-bold text-center tracking-tight mb-2 text-pink-900">
              Bookings
            </h1>
            <p className="text-center text-pink-400 mb-8">
              Check out our availability and book the date and time that works
              for you
            </p>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-4" />
                <p className="text-pink-900">Loading booking information...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Selection */}
                <div className="lg:col-span-2">
                  {/* Artist and Service Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <label
                        htmlFor="artist-select"
                        className="block text-pink-900 font-medium mb-2"
                      >
                        Select Artist
                      </label>
                      <Select onValueChange={handleArtistSelect}>
                        <SelectTrigger
                          id="artist-select"
                          className="w-full border-pink-200 focus:ring-pink-500"
                        >
                          <SelectValue placeholder="Choose an artist" />
                        </SelectTrigger>
                        <SelectContent>
                          {artists.map((artist) => (
                            <SelectItem key={artist.id} value={artist.id}>
                              {artist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label
                        htmlFor="service-select"
                        className="block text-pink-900 font-medium mb-2"
                      >
                        Select Service
                      </label>
                      <Select onValueChange={handleServiceSelect}>
                        <SelectTrigger
                          id="service-select"
                          className="w-full border-pink-200 focus:ring-pink-500"
                        >
                          <SelectValue placeholder="Choose a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold mb-4 text-pink-900">
                    Select a Date and Time
                  </h2>
                  <p className="text-sm text-pink-400 mb-4">
                    Timezone: Pacific Daylight Time (PDT)
                  </p>

                  {/* Month Navigation */}
                  <CalendarHeader
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    onPrevMonth={goToPrevMonth}
                    onNextMonth={goToNextMonth}
                  />

                  {/* Calendar */}
                  <div className="mb-6">
                    {/* Days of week */}
                    <div className="grid grid-cols-7 mb-2">
                      {daysOfWeek.map((day, index) => (
                        <div
                          key={index}
                          className="text-center text-sm font-medium py-2 text-pink-900"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                      {renderedCalendarDays}
                    </div>
                  </div>

                  {/* Selected Date */}
                  {selectedDate && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4 text-pink-900">
                        {formatSelectedDate()}
                      </h3>

                      {/* Time Slots */}
                      <TimeSlotSelector
                        selectedDate={selectedDate}
                        selectedArtist={selectedArtist}
                        timeSlots={timeSlots}
                        selectedTime={selectedTime}
                        onTimeSelect={handleTimeSelect}
                        isLoading={isLoadingTimeSlots}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column - Booking Summary */}
                <div className="lg:col-span-1">
                  <BookingSummary
                    selectedArtist={selectedArtist}
                    selectedService={selectedService}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    formatSelectedDate={formatSelectedDate}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

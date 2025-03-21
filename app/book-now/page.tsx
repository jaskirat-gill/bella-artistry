"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatDateToYYYYMMDD, formatDuration } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Service, { Artist } from "@/lib/types";
import { getArtists, getServices } from "@/api/controller";
import { fetchEventsForDay } from "@/api/calendar";

// Helper functions for calendar
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const getMonthName = (month: number) => {
  return new Date(0, month).toLocaleString("default", { month: "long" });
};

const getDayName = (year: number, month: number, day: number) => {
  return new Date(year, month, day).toLocaleString("default", {
    weekday: "long",
  });
};

interface CalendarDate {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

export default function BookingPage() {
  // Current date for reference
  const today = new Date();

  // State for calendar navigation
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // State for selections
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDate[]>([]);

  const [services, setServices] = useState<Service[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [timeSlots, setTimeslots] = useState<string[]>([]);
  const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  // Fetch Data
  useEffect(() => {
    getServices().then((services) => {
      setServices(services);
    });
    getArtists().then((artists) => {
      setArtists(artists);
    });
  }, []);
  useEffect(() => {
    if (!selectedDate) return;
    if (!selectedArtist) return;
    console.log(selectedArtist);
    fetchEventsForDay(
      selectedArtist.calendarId,
      formatDateToYYYYMMDD(selectedDate)
    ).then((events) => {
      setTimeslots(events);
    });
  }, [selectedDate, selectedArtist]);

  // Generate calendar days
  useEffect(() => {
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

    setCalendarDays(days);
  }, [currentMonth, currentYear]);

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: CalendarDate) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  // Get selected service price
  const getServicePrice = () => {
    if (!selectedService) return null;
    return selectedService.price;
  };

  // Format date for display
  const formatSelectedDate = () => {
    if (!selectedDate) return "";
    const dayName = getDayName(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day
    );
    const monthName = getMonthName(selectedDate.month);
    return `${dayName}, ${selectedDate.day} ${monthName} ${selectedDate.year}`;
  };

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
      </video>

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Selection */}
              <div className="lg:col-span-2">
                {/* Artist and Service Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-pink-900 font-medium mb-2">
                      Select Artist
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setSelectedArtist(
                          artists.find((artist) => artist.id === value) || null
                        )
                      }
                    >
                      <SelectTrigger className="w-full border-pink-200 focus:ring-pink-500">
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
                    <label className="block text-pink-900 font-medium mb-2">
                      Select Service
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setSelectedService(
                          services.find((service) => service.id === value) ||
                            null
                        )
                      }
                    >
                      <SelectTrigger className="w-full border-pink-200 focus:ring-pink-500">
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.title} (${service.price})
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-pink-900">
                    {getMonthName(currentMonth)} {currentYear}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 rounded-full hover:bg-pink-100 text-pink-500"
                      onClick={goToPrevMonth}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      className="p-1 rounded-full hover:bg-pink-100 text-pink-500"
                      onClick={goToNextMonth}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

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
                    {calendarDays.map((date, index) => {
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
                              ? "text-pink-300"
                              : "hover:bg-pink-100 text-pink-900",
                            isSelected
                              ? "bg-pink-500 text-white hover:bg-pink-600"
                              : "",
                            isToday && !isSelected ? "font-bold" : ""
                          )}
                          disabled={!date.isCurrentMonth}
                          onClick={() => handleDateSelect(date)}
                        >
                          {date.day}
                          {isToday && !isSelected && (
                            <div className="absolute bottom-1 w-1 h-1 bg-pink-500 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Date */}
                {selectedDate && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4 text-pink-900">
                      {formatSelectedDate()}
                    </h3>

                    {/* Time Slots */}
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
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Booking Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg border border-pink-100 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6 text-pink-900">
                    Booking Summary
                  </h2>

                  {selectedArtist &&
                  selectedService &&
                  selectedDate &&
                  selectedTime ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-pink-900">
                          {selectedService.title}
                        </h3>
                        <p className="text-pink-400">
                          with {selectedArtist.name}
                        </p>
                        <p className="text-pink-400">{formatSelectedDate()}</p>
                        <p className="text-pink-400">{selectedTime}</p>
                        <div className="mt-2 pt-2 border-t border-pink-100">
                          <p className="text-sm text-pink-400">
                            {formatDuration(selectedService.duration)}
                          </p>
                          <p className="font-medium text-pink-900">
                            ${getServicePrice()?.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <Button className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white">
                        Next
                      </Button>
                    </div>
                  ) : (
                    <p className="text-pink-400 italic">
                      Please select an artist, service, date and time to see
                      your booking summary
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

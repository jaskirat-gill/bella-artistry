import { NextResponse } from "next/server";
import { fromZonedTime, format } from "date-fns-tz";
import { CalendarEvent } from "@/lib/types";

interface GoogleCalendarEvent {
  start: { dateTime: string };
  end: { dateTime: string };
  summary: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const calendarId = searchParams.get("calendarId");
    const date = searchParams.get("date");

    if (!calendarId || !date) {
      return new NextResponse(
        JSON.stringify({ error: "Missing calendarId or date parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) throw new Error("Missing Google API Key");

    // Define the PST time zone (America/Los_Angeles)
    const timeZone = "America/Los_Angeles";

    // Create start and end of day in PST and convert them to UTC for the API call
    const startOfDayUtc = fromZonedTime(`${date}T00:00:00`, timeZone).toISOString();
    const endOfDayUtc = fromZonedTime(`${date}T23:59:59`, timeZone).toISOString();

    // Google Calendar API URL using UTC times
    const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?timeMin=${startOfDayUtc}&timeMax=${endOfDayUtc}&singleEvents=true&orderBy=startTime&key=${apiKey}`;

    // Fetch data from Google Calendar API
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch events");
    }

    const events: CalendarEvent[] = data.items.map(
      (item: GoogleCalendarEvent) => ({
        start: { dateTime: item.start.dateTime },
        end: { dateTime: item.end.dateTime },
        summary: item.summary,
      })
    );

    const timeSlots = generateTimeSlots(events, timeZone);
    console.log("Available time slots:", timeSlots);
    return new NextResponse(JSON.stringify({ timeSlots }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return new NextResponse(
      JSON.stringify({
        error: (error as Error).message || "Error fetching events",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

const generateTimeSlots = (events: CalendarEvent[], timeZone: string): string[] => {
  const availableSlots: Set<string> = new Set(); // Available slots
  const busySlots: CalendarEvent[] = []; // Busy events with start/end times

  // Helper function to generate 60-minute slots within a given time range
  const generateSlotRange = (start: Date, end: Date) => {
    const slots: string[] = [];
    const currentSlot = new Date(start);

    while (currentSlot < end) {
      // Format the current slot in PST
      const slotString = format(currentSlot, "HH:mm", { timeZone });
      slots.push(slotString);
      currentSlot.setHours(currentSlot.getHours() + 1); // Increase by 1 hour
    }
    console.log("Slots:", slots);
    return slots;
  };

  // Separate available and busy events
  events.forEach((event) => {
    const startTime = new Date(event.start.dateTime);
    const endTime = new Date(event.end.dateTime);

    if (event.summary === "Available") {
      const slots = generateSlotRange(startTime, endTime);
      slots.forEach((slot) => availableSlots.add(slot));
    } else {
      busySlots.push(event);
    }
  });

  const result: Set<string> = new Set();

  availableSlots.forEach((slotStr) => {
    let isBusy = false;

    for (const busyEvent of busySlots) {
      const busyStart = new Date(busyEvent.start.dateTime);
      const busyEnd = new Date(busyEvent.end.dateTime);

      // Create a Date object using the busy event's day and the slot time
      const [hour, minute] = slotStr.split(":").map(Number);
      const slotDate = new Date(busyStart);
      slotDate.setHours(hour, minute, 0, 0);

      // If slot falls within a busy time range
      if (slotDate >= busyStart && slotDate < busyEnd) {
        isBusy = true;
        break;
      }
    }

    if (!isBusy) {
      result.add(slotStr);
    }
  });

  // Convert Set to Array & sort by time
  return Array.from(result).sort();
};

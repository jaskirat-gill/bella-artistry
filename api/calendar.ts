import { CalendarEvent } from "@/lib/types";

export const fetchEventsForDay = async (
  calendarId: string,
  date: string
): Promise<any[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) throw new Error("Missing Google API Key");

    // Convert date to ISO format with start & end times (assuming 'YYYY-MM-DD' format)
    const startOfDay = new Date(`${date}T00:00:00Z`).toISOString();
    const endOfDay = new Date(`${date}T23:59:59Z`).toISOString();

    // Google Calendar API URL
    const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?timeMin=${startOfDay}&timeMax=${endOfDay}&singleEvents=true&orderBy=startTime&key=${apiKey}`;

    // Fetch data
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch events");
    }

    console.log("Fetched events:", data.items);
    const events: CalendarEvent[] = data.items.map((item: any) => ({
      start: { dateTime: item.start.dateTime },
      end: { dateTime: item.end.dateTime },
      summary: item.summary, // Assuming summary contains "Available" or other names
    }));
    console.log("Parsed events:", events);
    return generateTimeSlots(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

const generateTimeSlots = (events: CalendarEvent[]): string[] => {
    const availableSlots: Set<string> = new Set(); // Available slots
    const busySlots: CalendarEvent[] = []; // Busy events with start/end times
  
    // Helper function to generate 60-minute slots within a given time range
    const generateSlotRange = (start: Date, end: Date) => {
      const slots: string[] = [];
      let currentSlot = new Date(start);
  
      while (currentSlot < end) {
        const slotString = currentSlot.toTimeString().slice(0, 5);
        slots.push(slotString);
        currentSlot.setHours(currentSlot.getHours() + 1); // Increase by 1 hour
      }
  
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
    
          // Create a Date object using the same day as the busy event and the slot time
          const [hour, minute] = slotStr.split(":").map(Number);
          const slotDate = new Date(busyStart);
          slotDate.setHours(hour, minute, 0, 0);
    
          console.log("Checking slot:", slotDate);
          console.log("Busy event:", busyStart, busyEnd);
          console.log("Slot falls within busy range:", slotDate >= busyStart && slotDate < busyEnd);
    
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

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

    const events: CalendarEvent[] = data.items.map((item: any) => ({
      start: { dateTime: item.start.dateTime },
      end: { dateTime: item.end.dateTime },
    }));

    return generateTimeSlots(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

const generateTimeSlots = (events: CalendarEvent[]): string[] => {
  const timeSlots = new Set<string>(); // Use Set to avoid duplicate slots

  events.forEach((event) => {
    const startTime = new Date(event.start.dateTime);
    const endTime = new Date(event.end.dateTime);

    let currentSlot = new Date(startTime);
    while (currentSlot < endTime) {
      // Format as "HH:mm"
      const slotString = currentSlot.toTimeString().slice(0, 5);
      timeSlots.add(slotString);

      // Move to the next 1-hour slot
      currentSlot.setHours(currentSlot.getHours() + 1);
    }
  });

  return Array.from(timeSlots).sort(); // Convert Set to Array & sort by time
};

import { NextResponse } from "next/server";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { getArtistById, getServiceById } from "@/api/controller";
import { BookingData } from "@/lib/types";

// Ensure date is formatted correctly as YYYY-MM-DD
const formatDateString = (date: string) => {
  const [year, month, day] = date.split("-").map((num) => num.padStart(2, "0"));
  return `${year}-${month}-${day}`;
};
 
export async function POST(req: Request) {
  try {
    const booking: BookingData = await req.json();
    console.log("Creating Google Calendar event:", booking);

    if (
      !booking.artistId ||
      !booking.serviceId ||
      !booking.date ||
      !booking.time
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //Load service account credentials from env
    const serviceAccount = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT || "{}"
    );

    const auth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Fetch artist calendar ID and service duration
    const artist = await getArtistById(booking.artistId);
    const service = await getServiceById(booking.serviceId);
    const calendarId = artist?.calendarId;
    const duration = service?.duration || 60;

    if (!calendarId) {
      return NextResponse.json(
        { error: "Artist calendar ID not found" },
        { status: 404 }
      );
    }

    // Fix date formatting
    const formattedDate = formatDateString(booking.date);

    const parseTime = (time: string): string => {
      const match = time.match(/(\d+)\s?(am|pm)/i);
      if (!match) {
        throw new Error(`Invalid time format: ${time}`);
      }
      const [_, hour, period] = match;
      void(_)
      const hour24 = period.toLowerCase() === "pm" && hour !== "12" ? parseInt(hour) + 12 : parseInt(hour === "12" ? "0" : hour);
      return hour24.toString().padStart(2, "0") + ":00"; // Convert to "HH:00" format
    };
    console.log("Parsed time:", booking.time);
    const formattedTime = parseTime(booking.time);
    console.log("Formatted time:", formattedTime);
    const startTime = new Date(`${formattedDate}T${formattedTime}`);
    console.log("Start time:", startTime);
    if (isNaN(startTime.getTime())) throw new Error("Invalid start time");
    
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const event = {
      summary: `${booking.firstName} ${booking.lastName} - ${service?.title}`,
      description: booking.notes || "No additional notes.",
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "America/Vancouver",
      },
      end: { dateTime: endTime.toISOString(), timeZone: "America/Vancouver" },
    };

    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    return NextResponse.json({ success: true, event: response.data });
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

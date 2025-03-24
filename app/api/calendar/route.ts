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

    // Load service account credentials from env
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

    // Construct start and end times
    const startTime = new Date(`${formattedDate}T${booking.time}:00`);
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

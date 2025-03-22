export default interface Service {
    id: string;
    title: string;
    duration: number;
    price: number;
    description: string;
    featured: boolean;
    slug: string;
}

export interface Artist {
    id: string;
    name: string;
    calendarId: string;
}

export interface CalendarEvent {
    start: { dateTime: string };
    end: { dateTime: string };
  }
  
export interface BookingData {
  artistId: string | null;
  serviceId: string | null;
  date: string | null;
  time: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
}
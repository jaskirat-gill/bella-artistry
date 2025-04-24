export default interface Service {
  id: string;
  title: string;
  duration: number;
  description: string;
  featured: boolean;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
}

export interface PortfolioItem {
  id: string;
  name: string;
  description: string;
  sourceUrl: string;
}

export interface CalendarEvent {
  start: { dateTime: string };
  end: { dateTime: string };
  summary: string;
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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string | null;
  bio: string;
  specialties: string[];
  experience: string;
  calendarId: string;
}

export interface MasterConfig {
  companyName: string;
  landingPageTagline: string;
  phoneNumber: string;
  email: string;
  instagramLink: string;
  instagramHandle: string;
  aboutPageContent: string;
  missionStatement: string;
  websiteUrl: string;
  paymentNote: string;
  servicesPageContent: string;
  testimonialsPageContent: string;
}

import Service, { TeamMember, PortfolioItem, Testimonial } from "@/lib/types";
import { GET_SERVICES, GET_SERVICE_BY_ID } from "./queries/services";
import { GET_ARTISTS, GET_ARTIST_BY_ID } from "./queries/artists";
import { GET_TESTIMONIALS } from "./queries/testimonials";
import { GET_PORTFOLIO } from "./queries/portfolio";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL as string;

async function fetchGraphQL(query: string, variables = {}): Promise<any> {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      cache: "no-store", // Use "force-cache" for static pages
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("GraphQL fetch error:", error);
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  const data = await fetchGraphQL(GET_SERVICES);
  if (!data) return [];

  return data.services.nodes.map((node: any) => ({
    id: node.id,
    title: node.title,
    slug: node.title.toLowerCase().replace(/\s+/g, "-"),
    ...node.serviceFields,
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await fetchGraphQL(GET_TESTIMONIALS);
  if (!data) return [];

  return data.testimonials.nodes.map((node: any) => ({
    id: node.id,
    name: node.title,
    ...node.testimonialfields,
  }));
}

export async function getServiceById(id: string): Promise<Service | null> {
  const data = await fetchGraphQL(GET_SERVICE_BY_ID, { id });
  if (!data || !data.service) return null;

  return {
    id: data.service.id,
    title: data.service.title,
    slug: data.service.title.toLowerCase().replace(/\s+/g, "-"),
    ...data.service.serviceFields,
  };
}


export async function getArtists(): Promise<TeamMember[]> {
  const data = await fetchGraphQL(GET_ARTISTS);
  if (!data) return [];

  return data.teamMembers.nodes.map((node: any) => ({
    id: node.id,
    name: node.title,
    role: node.teammemberfields.role,
    bio: node.teammemberfields.bio,
    specialties: node.teammemberfields.specialtiesSeparatedByCommas.split(",").map((s: string) => s.trim()),
    experience: node.teammemberfields.experience,
    image: node.teammemberfields.profilePicture ? node.teammemberfields.profilePicture.node.sourceUrl : null,
    calendarId: node.teammemberfields.calendarId,
  }));
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const data = await fetchGraphQL(GET_PORTFOLIO);
  if (!data) return [];

  return data.portfolios.nodes.map((node: any) => ({
    id: node.id,
    name: node.title,
    description : node.portfoliofields.description,
    sourceUrl : node.portfoliofields.image.node.sourceUrl,
  }));
}

export async function getArtistById(id: string): Promise<TeamMember | null> {
  const data = await fetchGraphQL(GET_ARTIST_BY_ID, { id });
  if (!data || !data.teamMember) return null;
  console.log("data", data);
  return {
    id: data.teamMember.id,
    name: data.teamMember.title,
    role: data.teamMember.teammemberfields.role,
    bio: data.teamMember.teammemberfields.bio,
    specialties: data.teamMember.teammemberfields.specialtiesSeparatedByCommas.split(",").map((s: string) => s.trim()),
    experience: data.teamMember.teammemberfields.experience,
    image: data.teamMember.teammemberfields.profilePicture ? data.teamMember.teammemberfields.profilePicture.node.sourceUrl : null,
    calendarId: data.teamMember.teammemberfields.calendarId,
  };
}

import Service, { Artist } from "@/lib/types";
import { GET_SERVICES } from "./queries/services";
import { GET_ARTISTS } from "./queries/artists";

export function getServices(): Promise<Service[]> {
  return fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: GET_SERVICES }),
    cache: "no-store", // Use "force-cache" for static pages
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const services: Service[] = data.data.services.nodes.map((node: any) => ({
        id: node.id,
        title: node.title,
        slug: node.title.toLowerCase().replace(/\s+/g, '-'),
        ...node.serviceFields,
      }));
      return services;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      return [];
    });
}

export function getArtists(): Promise<Artist[]> {
  return fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: GET_ARTISTS }),
    cache: "no-store", // Use "force-cache" for static pages
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const artists: Artist[] = data.data.teamMembers.nodes.map((node: any) => ({
        id: node.id,
        name: node.title,
        calendarId: node.teamFields.calendarId,
      }));
      return artists;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      return [];
    });
}

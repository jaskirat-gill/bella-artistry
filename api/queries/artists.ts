export const GET_ARTISTS = `
query {
  teamMembers {
    nodes {
      id
      title
      teamFields {
        calendarId
      }
    }
  }
}
`;

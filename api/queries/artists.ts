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

export const GET_ARTIST_BY_ID = `
query($id: ID!) {
  teamMember(id: $id) {
    id
    title
    teamFields {
      calendarId
    }
  }
}
`;

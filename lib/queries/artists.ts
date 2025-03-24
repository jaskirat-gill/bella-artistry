export const GET_ARTISTS = `
query {
     teamMembers {
    nodes {
      id
      title
      teammemberfields {
        role
        bio
        specialtiesSeparatedByCommas
        experience
        calendarId
        profilePicture {
          node {
            id
            sourceUrl
            altText
          }
        }
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
      teammemberfields {
        role
        bio
        specialtiesSeparatedByCommas
        experience
        calendarId
        profilePicture {
          node {
            id
            sourceUrl
            altText
          }
        }
      }
    }
  
  }
`;

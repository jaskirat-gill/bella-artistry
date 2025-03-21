export const GET_SERVICES = `
  query {
    services {
      nodes {
        id
        title
        serviceFields {
          price
          duration
          description
          featured
        }
      }
    }
  }
`;

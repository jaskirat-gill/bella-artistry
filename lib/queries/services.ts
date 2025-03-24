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

export const GET_SERVICE_BY_ID = `
query($id: ID!) {
  service(id: $id) {
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
`;

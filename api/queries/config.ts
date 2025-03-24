export const GET_CONFIG = `
  query {
    masterConfigs {
      nodes {
        masterConfigFields {
          companyName
        }
      }
    }
  }
`;
export const GET_CONFIG = `
  query {
    masterConfigs {
      nodes {
        id
        title
        masterConfigFields {
          companyName
          landingPageTagline
          phoneNumber
          email
          instagramLink
          instagramHandle
          aboutPageContent
          missionStatement
          websiteUrl
          paymentNote
          servicesPageContent
          testimonialsPageContent
        }
      }
    }
  }
`;
export const GET_PORTFOLIO = `
query{
 portfolios {
    nodes {
      id
      title
      portfoliofields {
        description
        image {
          node {
            id
            sourceUrl
            altText
          }
        }
      }
    }
  }
}`;

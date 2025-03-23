export const GET_TESTIMONIALS = `
query {
    testimonials {
      nodes {
        id
        title
        testimonialfields {
          quote
        }
      }
    }
  }
`;
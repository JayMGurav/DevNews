import { gql } from '@apollo/client';

export const COMMON_LINK_FIELDS = gql`
  fragment CommonLinkFields on Link {
    id
    description
    url
    voteCount
    createdAt
    votes {
      id
      user {
        id
      }
    }
    postedBy{
      id
      name
    }
  }
`;
import { gql } from '@apollo/client';
import { COMMON_LINK_FIELDS } from './fragments.graphql';


export const NEW_LINKS_SUBSCRIPTION = gql`
  ${COMMON_LINK_FIELDS}
  subscription {
    newLink {
      ...CommonLinkFields
    }
  }
`;


export const NEW_VOTES_SUBSCRIPTION = gql`
  ${COMMON_LINK_FIELDS}
  subscription {
    newVote {
      id
      link {
        ...CommonLinkFields
      }
      user {
        id
      }
    }
  }
`;
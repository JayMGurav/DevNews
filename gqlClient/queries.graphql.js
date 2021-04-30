import { gql } from '@apollo/client';
import { COMMON_LINK_FIELDS } from './fragments.graphql';


export const FEED_QUERY = gql`
  ${COMMON_LINK_FIELDS}
  query FeedQuery(
    $orderBy: LinkOrderByInput
  ) {
    feed(orderBy: $orderBy) {
      ...CommonLinkFields
    }
  }
`;

export const IS_LOGGED_IN_QUERY = gql`
  {
    isLoggedIn 
  }
`;

export const ME_NAME = gql`
  {
    me{
      id
      name
    } 
  }
`;

export const ME_DETAILS = gql`
  {
    me{
      id
      name
      email
      links{
        id
        url
        voteCount
      }
      votes {
        id
        link {
          id
          url
          voteCount
        }
      }
    } 
  }
`;



export const IS_REGISTERED_USER_QUERY = gql`
   query IsRegisteredUser($email: String!) {
    isRegisteredUser(email: $email)
  }
`;


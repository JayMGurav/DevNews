import { gql } from '@apollo/client';

export const FEED_QUERY = gql`
  query FeedQuery(
    $orderBy: LinkOrderByInput
  ) {
    feed(orderBy: $orderBy) {
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
  }
`;

export const IS_LOGGED_IN_QUERY = gql`
  {
    isLoggedIn 
  }
`;

export const IS_REGISTERED_USER_QUERY = gql`
   query IsRegisteredUser($email: String!) {
    isRegisteredUser(email: $email)
  }
`;
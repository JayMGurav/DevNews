import { gql } from '@apollo/client';

export const FEED_QUERY = gql`
  {
    feed {
      id
      description
      url
      voteCount
      createdAt
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
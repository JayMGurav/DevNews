import { gql } from '@apollo/client';

export const CREATE_LINK_MUTATION  = gql`
   mutation CreateLinkMutation(
    $description: String!
    $url: String!
  ) {
    post(description: $description, url: $url) {
      id
      url
      description
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signup(
      email: $email
      password: $password
      name: $name
    ) {
      token
    }
  }
`;


export const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $email: String!
    $password: String!
  ) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
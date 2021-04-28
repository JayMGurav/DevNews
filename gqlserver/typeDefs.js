import {  gql } from 'apollo-server-micro';


export default gql`
  type User {
    id:ID!
    name: String!
    email: String!
    links: [Link!]
    votes: [Vote!]
  }

  type Link {
    id: ID!
    description: String!
    url: String!
    postedBy: User!
    votes: [Vote!]
    voteCount: Int!
    createdAt: String!
  }

  type Vote {
    id: ID!
    link: Link!
    user: User!
  }

  type Subscription {
    newLink: Link
    newVote: Vote
  }


  type AuthPayload {
    token: String
    user: User
  }

  input LinkOrderByInput {
    createdAt: Sort
    voteCount: Sort
  }

  enum Sort {
    asc
    desc
  }

  type Query {
    isRegisteredUser(email: String!): Boolean!
    user(id: ID!): User
    users: [User!]
    feed(filter: String, orderBy: LinkOrderByInput): [Link!]
    link(id: ID!): Link
    isLoggedIn: Boolean!
  }

  type Mutation {
    signup(email: String!, password: String!, name: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    post(url: String!, description: String!): Link!
    updateLink(id: ID!, url: String, description: String): Link
    deleteLink(id: ID!): Link!
    vote(linkId: ID!): Vote!
    deleteVote(linkId: ID!): Vote!
  }
`

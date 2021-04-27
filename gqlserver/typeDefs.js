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

  type Query {
    user(id: ID!): User
    users: [User!]
    feed(filter: String): [Link!]
    link(id: ID!): Link
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

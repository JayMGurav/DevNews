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
    newLink: Link!
    newVote: Vote!
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
    me: User!
    user(id: ID!): User!
    users: [User!]
    isLoggedIn: Boolean!
    isRegisteredUser(email: String!): Boolean!
    feed(filter: String, orderBy: LinkOrderByInput): [Link!]
    link(id: ID!): Link
  }

  type Mutation {
    signup(email: String!, password: String!, name: String!): User
    login(email: String!, password: String!): User
    signOut: Boolean!
    post(url: String!, description: String!): Link!
    updateLink(id: ID!, url: String, description: String): Link
    deleteLink(id: ID!): Link!
    vote(linkId: ID!): Vote!
    deleteVote(linkId: ID!): Vote!
  }
`


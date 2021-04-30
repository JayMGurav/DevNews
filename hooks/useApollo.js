import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from 'apollo-link-ws';
// import { SubscriptionClient } from 'subscriptions-transport-ws'

let apolloClient;
// const APOLLO_STATE = "APOLLO_STATE";
const httpURI = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/graphql`;
const wsURI = `ws://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/graphqlSubscriptions`;

const wsLink = new WebSocketLink({
  uri: wsURI,
  options: {
    lazy: true,
    reconnect: true,
    minTimeout: 9000,
  },
  webSocketImpl: require('websocket').w3cwebsocket
});


const httpLink =  new HttpLink({
  uri: httpURI,
  credentials: 'same-origin',
});


const link = split(
  ({query}) => {
    const { kind, operation } = getMainDefinition(query);    
    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

function createApolloClient() {
  return new ApolloClient({
    link,
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    
    name: "next_web_client",
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if(initialState){
    _apolloClient.cache.restore(initialState);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
    // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  
  return _apolloClient;
}


export function useApollo(initialState){
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
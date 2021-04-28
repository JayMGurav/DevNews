import { useMemo } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';

let apolloClient;
// const APOLLO_STATE = "APOLLO_STATE";
const uri = `http://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/graphql`;
// console.log(uri)
// function createIsomorphicPhoneBookLink(){
//   if(typeof window == 'undefined'){
//     const { SchemaLink } = require('@apollo/client/link/schema');
//     const schema = require('@/gqlserver/schema');
//     return new SchemaLink({ schema });
//   }else{
//     return new HttpLink({
//       uri: '/api/graphql',
//       credentials: 'same-origin',
//     });
//   }
// }


function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link:  new HttpLink({
      uri: uri,
      credentials: 'same-origin',
    }),
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
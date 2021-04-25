import { useMemo } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
// import { SchemaLink } from '@apollo/client/link/schema';


// const SchemaLink = dynamic(
//   () => import('@apollo/client/link/schema').then((mod) => mod.SchemaLink),
//   { ssr: true }
// );
  

// const HttpLink  = dynamic(
//   () => import('@apollo/client/link/http').then((mod) => mod.HttpLink ),
//   { ssr: true }
// );
  
// const schema = dynamic(
//   () => import('@/gqlserver/schema'),
//   { ssr: true }
// );


let apolloClient;
// const APOLLO_STATE = "APOLLO_STATE";

function createIsomorphicPhoneBookLink(){
  if(typeof window == 'undefined'){
    const { SchemaLink } = require('@apollo/client/link/schema');
    const schema = require('@/gqlserver/schema');
    return new SchemaLink({ schema });
  }else{
    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    });
  }
}


function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphicPhoneBookLink(),
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
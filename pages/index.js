import Head from 'next/head';
import { Container, Heading, Flex } from '@chakra-ui/react';
import Login from '@/components/Login';
import { IS_LOGGED_IN_QUERY } from '@/gqlClient/queries.graphql';

import { initializeApollo } from '@/hooks/useApollo';

export default function Home(){
  return(
    <div>
      <Head>
        <title>Devnews</title>
      </Head>
      <Container w="100%" h="100vh" minH="100vh">
        <Flex w="100%" h="100%" flexDirection="column" align="center" justify="center">
          <Heading as="h1" size="xl" mb="10">📰DevNews</Heading>
          <Login/>
        </Flex>
      </Container>
    </div>
  );
}


export async function getServerSideProps(context) {
  const client = initializeApollo()
  if(client){
    const { data } = await client.query({
      query: IS_LOGGED_IN_QUERY ,
      context: {
        headers: {
          ...context.req.headers
        },
      },
    });
  
    if(data?.isLoggedIn){
      return {
        redirect: {
          permanent: false,
          destination: "/news"
        }
      }
    }
  }
  return {
    props: {
     isLoggedIn: false
    },
  };
}
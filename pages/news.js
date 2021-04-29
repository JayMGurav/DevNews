import Head from 'next/head';
import {Box} from "@chakra-ui/react";

import { IS_LOGGED_IN_QUERY } from '@/gqlClient/queries.graphql';
import { initializeApollo } from '@/hooks/useApollo';
import Layout from "@/components/Layout";
import CreateLink from "@/components/CreateLink"
import FeedList from '@/components/FeedList';

export default function PostNews(){
  return(
    <Layout>
      <Head>
        <title>Devnews | news</title>
      </Head>
      
      <Box w="100%" py="4" my="4">
        <CreateLink/>
        <FeedList/> 
      </Box>
    </Layout>
  );
}


export async function getServerSideProps(context) {
  const client = initializeApollo()
  if(client){
    const { data } = await client.query({
      query: IS_LOGGED_IN_QUERY,
      context: {
        headers: {
          ...context.req.headers
        },
      },
    });
  
    if(!data?.isLoggedIn){
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      }
    }
  }

  return {
    props: {
     isLoggedIn: true
    },
  };
}
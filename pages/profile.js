import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { 
  Flex,
  Link,
  Box, 
  Heading, 
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  Spacer,
  Badge,
  Avatar,
} from '@chakra-ui/react';
import {ExternalLinkIcon} from "@chakra-ui/icons";

import { initializeApollo } from '@/hooks/useApollo';
import { IS_LOGGED_IN_QUERY, ME_DETAILS } from '@/gqlClient/queries.graphql';
import Layout from '@/components/Layout';



const MinimalLinkView = ({link}) => (
  <Flex my="4" p="3" bg="black.400" wrap="wrap" borderRadius="lg" boxShadow="md" align="center">
    <Link color="teal.100" fontSize="sm" href={link.url} isExternal rel="noopener noreferrer">
      {link.url.slice(0,30).concat("...")} <ExternalLinkIcon mx="2px" />
    </Link>
    <Spacer/>
    <Badge variant="subtle" color="black.200" bg="teal.50" boxShadow="md" borderRadius="full" px="3" mx="4">
      {link.voteCount || "0"}
    </Badge>
  </Flex>
)



export default function Profile(){

  const  { data, loading, error} = useQuery(ME_DETAILS,{
    fetchPolicy: "cache-and-network"
  });

  return(
    <Layout>
      <Head>
        <title>Devnews | profile</title>
      </Head>
      
      <Box w="100%" py="4" my="4">
       {error && (
         <Alert status="error" my="3" borderRadius="md" color="red.900">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>)
        }
        <Skeleton startColor="black.200" endColor="black.500" borderRadius="md" isLoaded={!loading}>
          { data && (
              <Box>
                <Flex mb="10" mt="4" wrap="wrap">
                  <Avatar name={data?.me?.name} src="" bg="black.25" boxShadow="lg" size="lg" mr="3"/>
                    <Box>
                      <Heading color="teal.50">{data?.me?.name.toUpperCase()}</Heading>
                      <Text>{data?.me?.email}</Text>
                    </Box>
                </Flex>
                {data?.me?.links.length > 0 && <Box my="10" >
                  <Heading as="h3" fontSize="xl">{data?.me?.links.length} Links Posted</Heading>
                  {data?.me?.links?.map((link) => <MinimalLinkView key={link.id} link={link} />)}
                </Box>}
                {data?.me?.votes.length > 0 && <Box my="4">
                  <Heading as="h3" fontSize="xl">{data?.me?.votes.length} Links Voted </Heading>
                  {data?.me?.votes.map((vote) => <MinimalLinkView key={vote.id} link={vote.link} />)}
                </Box>}
              </Box>
            )
          }
        </Skeleton>
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
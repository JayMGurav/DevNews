import { FEED_QUERY } from '@/gqlClient/queries.graphql';
import { NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from '@/gqlClient/subscription.graphql';
import { useQuery } from '@apollo/client';
import { 
  Box, 
  Heading, 
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
 } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import LinkComponent from './LinkComponent';

export default function FeedList(){
  const [errorMsg, setErrorMessage] = useState('');
  const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: {
      orderBy: { createdAt: 'desc', voteCount: 'desc' }
    },
  });
 
  // subscribeToMore({
  //   document: NEW_LINKS_SUBSCRIPTION,
  //   updateQuery: (prevRes, { subscriptionData }) => {
  //     if (!subscriptionData.data) return prevRes;

  //     const newLink = subscriptionData.data.newLink;
  //     const exists = prevRes.feed.find(
  //       ({ id }) => id === newLink.id
  //     );

  //     if (exists) return prevRes;

  //     return Object.assign({}, prevRes, {
  //       feed:  [newLink, ...prevRes.feed]
  //     });
  //   }
  // })

  // subscribeToMore({
  //   document: NEW_VOTES_SUBSCRIPTION
  // });

  useEffect(() => {
    let timeOutId;
    if(errorMsg){
      timeOutId = setTimeout(() => {
        setErrorMessage('');
      },4000);
    }
    return () => {
      return timeOutId ? clearTimeout(timeOutId) : false;
    }
  }, [errorMsg]);


  if(error){
    setErrorMessage(error.message);
  }
  
  return (
    <Box w="100" p="4" bg="black.500" my="12" borderRadius="md">
       { errorMsg && (
         <Alert status="error" my="3" borderRadius="md" color="red.900">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>)
        }
      <Skeleton startColor="black.200" endColor="black.500" borderRadius="md" isLoaded={!loading}>
      {data?.feed?.length > 0 ? (
        <>
          {data.feed.map((link) => (
            <LinkComponent key={link.id} link={link} setErrorMessage={setErrorMessage}/>
          ))}
        </>
      ) : (
        <Box textAlign="center" my="4">
          <Heading as="h1">No Links yet?</Heading>
          <Text color="teal.100">Go adhead and add one</Text>
        </Box>
      )}
    </Skeleton>
    </Box>
  );
};

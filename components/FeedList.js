import { FEED_QUERY } from '@/gqlClient/queries.graphql';
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
  const { data, loading, error } = useQuery(FEED_QUERY, {
    variables: {
      orderBy: { createdAt: 'desc' }
    }
  });
 
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
      <Skeleton startColor="black.200" endColor="teal.400" borderRadius="md" isLoaded={!loading}>
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

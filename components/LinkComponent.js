import { Box, Link, Text, Flex, Badge, Spacer, IconButton,Divider  } from "@chakra-ui/react";
import {ExternalLinkIcon, TriangleUpIcon} from "@chakra-ui/icons";
import { useMutation } from "@apollo/client";
import { VOTE_MUTATION } from "@/gqlClient/mutations.graphql";
import { FEED_QUERY } from "@/gqlClient/queries.graphql";

export default function LinkComponent({ link, setErrorMessage }){
  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    update: (cache, {data: {vote}}) => {
      const orderBy = { createdAt: 'desc', voteCount: 'desc' };
      const data = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          orderBy
        }
      });

      const updatedLinks = data.feed.map((feedlink) => {
        if(feedlink.id === link.id){
          return {
            ...feedlink,
            voteCount: feedlink.voteCount + 1,
            votes: [...feedlink.votes, vote]
          }
        }
        return link;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: updatedLinks
        }
      });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  return(
    <Flex my="4" p="3" bg="black.400" wrap="wrap" borderRadius="lg" boxShadow="md" align="center">
      <Box flex="3 1 30ch">
        <Link color="teal.100" fontSize="sm" href={link.url} isExternal rel="noopener noreferrer">
            {link.url.slice(0,30).concat("...")} <ExternalLinkIcon mx="2px" />
        </Link>
        <Text fontSize="large">{link.description}</Text>
        <Box d="flex" alignItems="baseline">
          <Text fontSize="sm" color="black.10">by {link?.postedBy?.name || "Unknown"}</Text>
          <Divider orientation="vertical" height="10px" mx="2"/>
          <Text fontSize="sm" color="black.10">{new Date(Date(link.createdAt)).toDateString()}</Text>
        </Box>
      </Box>
      <Spacer/>
      <Flex flex="1 1 10ch" m="2" align="center" justify="flex-end">
        <Badge variant="subtle" color="black.200" bg="teal.50" boxShadow="md" borderRadius="full" px="3" mx="4">
          {link.voteCount || "0"}
        </Badge>
        <IconButton 
          aria-label="Upvote" 
          variant="pushableBlack" 
          size="md" 
          color="teal.100"
          boxShadow="lg"
          icon={<TriangleUpIcon />} 
          onClick={vote} 
        />
      </Flex>
    </Flex>
  )
};

import NextLink from 'next/link';
import { useMutation, useQuery } from "@apollo/client";
import { 
  Flex, 
  Menu, 
  MenuButton,
  Button, 
  Text,  
  MenuItem, 
  MenuList, 
  Spacer,
  Skeleton,
  useToast,
  Link 
} from "@chakra-ui/react";
import {  AtSignIcon, ExternalLinkIcon, ChevronDownIcon } from '@chakra-ui/icons'

import { ME_NAME } from "@/gqlClient/queries.graphql";
import { SIGNOUT_MUTATION } from "@/gqlClient/mutations.graphql";
import { useRouter } from "next/router";

export default function NavBar(){
  const router = useRouter()
  const toast = useToast()
  const  { data, loading, error} = useQuery(ME_NAME);
  const  [signout] = useMutation(SIGNOUT_MUTATION, {
    onCompleted: ({signOut}) => {
      if(signOut){
        router.push('/');
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        position: "bottom-right",
        status: "error",
        variant: "subtle",
        duration: 5000,
        isClosable: true,
      })
    }
  });

  if(error){
    toast({
      title: "Error",
      description: error.message,
      position: "bottom-right",
      status: "error",
      variant: "subtle",
      duration: 5000,
      isClosable: true,
    })
  }


  return (
    <Flex as="nav" w="100%" py="4" mb="8">
      
      <NextLink href="/">
      <Link _hover={{border:"none"}}>
        <Text fontSize="md" color="teal.100" fontWeight="semibold">
          <span role="img" style={{fontSize:"30px"}}>📰</span>
          DevNews
        </Text>
        </Link>
      </NextLink>
      <Spacer/>
      <Menu gutter="10" autoSelect={false}>
        <Skeleton isLoaded={!loading} >
          <MenuButton          
            px="4"
            py="2"
            size="xs"
            borderRadius="xl"
            aria-label="Options"
            variant="black"
            as={Button} rightIcon={<ChevronDownIcon />}
          >  
            {data?.me?.name}
          </MenuButton>
        </Skeleton>
        <MenuList bg="black.50" border="none"> 
          <MenuItem 
            icon={<AtSignIcon />} 
            _hover={{
              bg:"black.25"
            }} 
            onClick={() => router.push('/profile')}
          >
              {data?.me?.name}
          </MenuItem>
          <MenuItem 
            icon={<ExternalLinkIcon />}  
            _hover={{
                bg:"black.25"
            }}
            onClick={signout}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Input,
  Button,
  FormControl,
  Box,
  List,
  ListItem,
  ListIcon
} from "@chakra-ui/react"
import { SmallCloseIcon } from '@chakra-ui/icons'

import { CREATE_LINK_MUTATION } from '@/gqlClient/mutations.graphql';
import { FEED_QUERY } from '@/gqlClient/queries.graphql';


export default function CreateLink(){

  const { register, formState: { errors }, handleSubmit, reset  } = useForm();
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const [postLink, { error: postlinkError }] = useMutation(CREATE_LINK_MUTATION, {
    update: (cache, { data: { post } }) => {
      const orderBy = { createdAt: 'desc' };
      const data = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          orderBy
        }
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed:  [post, ...data.feed]
        },
        variables: {
          orderBy
        }
      });

    },
    onCompleted: () => {
      reset({url:"", description:"" });
      setLoading(() => {
        setLoadingMsg("");
        return false
      });
    },
    onError: () => {
      reset({url:"", description:"" });
      setLoading(() => {
        setLoadingMsg("Error");
        return false
      });
    }
  }); 

  const onSubmit = (data) => {
    console.log(data);
    setLoading(() => {
      setLoadingMsg("Posting...")
      return true;
    });
    postLink({
      variables: {...data}
    })
  }

  return (
   <Box>
      { postlinkError && (
        <Alert status="error" my="4" borderRadius="md" color="red.900">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{postlinkError?.message}</AlertDescription>
        </Alert>)
      }
      <Flex as="form" wrap="wrap" style={{gap:"2ch"}} 
      onSubmit={handleSubmit(onSubmit)}
    > 
      <FormControl  
        id="url" 
        isInvalid={errors.url && errors.url?.message} flex="2 1 10ch">
        <Input 
          name="url" 
          type="text" 
          bg="black.400" 
          borderRadius="md" 
          border="none" 
          flex="2 1 15ch"
          errorBorderColor="red.200"
          placeholder="Post url"
          {...register('url', { required: "Url is required" })}
        />
      </FormControl>
      <FormControl  
        id="description" 
        isInvalid={errors.description && errors.description?.message} flex="3 1 20ch">
        <Input 
          name="description" 
          type="text" 
          bg="black.400" 
          borderRadius="md" 
          border="none" 
          flex="3 1 30ch"
          errorBorderColor="red.200"
          placeholder="A small description about post"
          {...register('description', { required: "Description is required",  maxLength: { value: 50, message:"Max length 50" } })}
        />
      </FormControl>
      <Button 
        type="submit" 
        flex="1 1 4ch"
        variant="pushable"
        borderRadius="md"
        py="2"
        px="4"
      >
        {loading ? loadingMsg : "Post link"}
      </Button>
    </Flex>
    { errors && (
      <List spacing="1" my="2">
      {errors.url && (
        <ListItem color="red.200">
          <ListIcon as={SmallCloseIcon} color="red.200" />
            {errors?.url?.message}
        </ListItem>)
      }
      {errors.description && (
        <ListItem color="red.200">
          <ListIcon as={SmallCloseIcon} color="red.200" />
            {errors?.description?.message}
        </ListItem>)
      }
      </List>)
    }
   </Box>
  );
};

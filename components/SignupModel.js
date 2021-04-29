import { useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'

import {
  Alert,
  AlertIcon,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Box,
  Heading
} from "@chakra-ui/react"

import { SIGNUP_MUTATION } from '@/gqlClient/mutations.graphql';


export default function SignupModal({ email, password, isOpen, onOpen, onClose, error }){
  const router = useRouter()
  const initialRef = useRef()
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(error);
  const { register, formState: { errors }, handleSubmit } = useForm();


  const [signup] = useMutation(SIGNUP_MUTATION, {
    onCompleted: ({signup}) => {
      setLoading(() => {
        setLoadingMsg("");
        return false
      });
      
      
      router.push('/news');
    },
    onError: (error) => {
      setErrorMsg(error.message);
      setLoading(() => {
        setLoadingMsg("Error");
        return false
      });
    }
  });

  const onModalSubmit = async (data) => {
    setLoading(() => {
      setLoadingMsg("Setting up...");
      return true
    });
    signup({
      variables:{
       name: data.name,
       email,
       password,
      }
    });
  }

  function onModelClosed (){
    onClose();
  }

  return (
    <Modal
    initialFocusRef={initialRef}
    isOpen={isOpen}
    onClose={onModelClosed}
    as="form"
  >
    <ModalOverlay />
    <ModalContent as="form" onSubmit={handleSubmit(onModalSubmit)} bg="black.200">
      <ModalHeader display="flex" alignItems="center" bg="black.300" borderRadius="md">
        <Heading mr="2">📰</Heading>
        <Box>
          Complete registration
          <Text fontSize="xs">for {email}</Text>
        </Box>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody py={4}>
      { errorMsg && (
        <Alert status="error" my="4" borderRadius="md" color="red.900">
          <AlertIcon />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>)
      }
      <FormControl  
          id="fullname" 
          isInvalid={errors.name && errors.name?.message}>
          <FormLabel>Fullname</FormLabel>
          <Input
            name="name"
            type="text"
            placeholder="John Doe"
            errorBorderColor="red.50"
            bg="black.300"
            color="gray.500"
            borderRadius="lg"
            border="none"
            size="md"
            {...register('name', { required: "Name is required" })}
          />
          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>
      </ModalBody>

      <ModalFooter >
        <Button 
          type="submit" 
          mr={3} 
          size="sm"
        >
          {loading ? loadingMsg : "Register"}
        </Button>
        <Button onClick={onModelClosed} size="sm" borderRadius="md">Cancel</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}
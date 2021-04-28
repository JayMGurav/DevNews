import { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { 
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box, 
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Flex,
  Input,
  useDisclosure
} from '@chakra-ui/react';

import SignupModal from "./SignupModel";
import { LOGIN_MUTATION } from '@/gqlClient/mutations.graphql';
import { IS_REGISTERED_USER_QUERY } from '@/gqlClient/queries.graphql';


export default function Login(){
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { register, formState: { errors }, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [userData, setUserData] = useState({});
  
  const [login, { error: loginError }] = useMutation(LOGIN_MUTATION, {
    onCompleted: ({login}) => {
      setLoading(() => {
        setLoadingMsg("Here we go");
        return false
      });
      localStorage.setItem('token',login.token)
      router.push('/news');
    },
    onError: () => {
      setLoading(() => {
        setLoadingMsg("Error");
        return false
      });
    }
  }); 

  const [checkIsRegisteredUser] = useLazyQuery(IS_REGISTERED_USER_QUERY ,{
    onCompleted: (data) => {
      if(!data.isRegisteredUser){
        setLoading(() => {
          setLoadingMsg("sign up");
          return true
        });
        onOpen();
      }else {
        setLoading(() => {
          setLoadingMsg("Logging in...");
          return true
        });
        login({
          variables: {
            email: userData.email,
            password: userData.password
          }
        })
      }
    }
  })


  function onSubmit(data){
    setUserData(data);
    setLoading(true);
    setLoading(() => {
      setLoadingMsg("Verifying...");
      return true
    });

    checkIsRegisteredUser({
      variables: {
        email: data?.email
      }
    });
  }
  
  return(
    <Box>
      { loginError && (
        <Alert status="error" my="4" borderRadius="md" color="red.900">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{loginError?.message}</AlertDescription>
        </Alert>)
      }
      <Flex 
        as="form" 
        px="6"
        py="8" 
        bg="black.200"
        borderRadius="xl"
        direction="column"
        align="center"
        justifyContent="center"
        style={{gap:"3ch"}}
        w="sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl 
           id="email"
          isInvalid={errors.email && errors.email?.message}
        >
          <FormLabel>Email</FormLabel>
          <Input
            name="email" 
            type="email"
            placeholder="JohnDoe@mail.com"
            errorBorderColor="red.50"
            bg="black.300"
            color="gray.500"
            borderRadius="lg"
            border="none"
            size="md"
            {...register('email',{required: true, pattern: /^\S+@\S+$/i })}
          />
          <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
        </FormControl >
        <FormControl  
          id="password" 
          isInvalid={errors.password && errors.password?.message}>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="your password"
            errorBorderColor="red.50"
            bg="black.300"
            color="gray.500"
            borderRadius="lg"
            border="none"
            size="md"
            {...register('password', { required: "Password is required" })}
          />
          <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
        </FormControl>
        <Button 
          size="sm" 
          variant="pushable" 
          type="submit"
        >
          {loading ? loadingMsg : "Lets Go!!🚀"}
        </Button>
      </Flex>
        <SignupModal 
          isOpen={isOpen} 
          onOpen={onOpen} 
          onClose={onClose} 
          email={userData?.email} 
          password={userData?.password}
          error="Not registered? Please complete signing up"
        />
    </Box>
  )
};

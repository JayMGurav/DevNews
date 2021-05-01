import { useApollo } from "@/hooks/useApollo";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider,  } from "@chakra-ui/react"

import "@/styles/global.css";
import theme from "@/styles/theme";


export default function MyApp({ Component, pageProps }) {

  const apolloClient = useApollo(pageProps.initialApolloState)

 return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  )
}
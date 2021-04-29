import { Box } from "@chakra-ui/react";

import NavBar from "@/components/NavBar"

export default function Layout({children}){
  return (
    <Box as="main" maxW="800px" mx="auto" p="4">
      <NavBar />
      {children}
    </Box>
  );
}
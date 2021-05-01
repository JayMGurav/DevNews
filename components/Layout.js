import { Box, IconButton } from "@chakra-ui/react";
import {ChevronUpIcon} from "@chakra-ui/icons";

import useScrollToTop from '@/hooks/useScrollToTop';
import NavBar from "@/components/NavBar"

export default function Layout({children}){
  const [isBtnVisible, scrollToTop] = useScrollToTop();

  return (
    <Box as="main" maxW="800px" mx="auto" p="4">
      <NavBar />
      {children}
      <IconButton 
        position="fixed"
        bottom="8"
        right="8"
        aria-label="Scrool to top" 
        isDisabled={!isBtnVisible}
        _disabled={{
          bg: "black.100",
          color: "black.10",
          cursor:"not-allowed"
        }}
        icon={<ChevronUpIcon />}
        onClick={scrollToTop} 
        size="md"
        variant="pushable"
        isRound
      />
    </Box>
  );
}
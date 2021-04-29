import { 
  Flex, 
  Menu, 
  MenuButton,
  Button, 
  Text,  
  MenuItem, 
  MenuList, 
  Spacer 
} from "@chakra-ui/react";
import {  AtSignIcon, ExternalLinkIcon, ChevronDownIcon } from '@chakra-ui/icons'

export default function NavBar({user}){
  return (
    <Flex as="nav" w="100%" py="4" mb="8">
      <Text fontSize="md" color="teal.100" fontWeight="semibold">
        <span role="img" style={{fontSize:"30px"}}>📰</span>
         DevNews
      </Text>
      <Spacer/>
      <Menu gutter="10" autoSelect={false}>
        <MenuButton          
          px="4"
          py="2"
          size="xs"
          borderRadius="xl"
          aria-label="Options"
          variant="black"
          as={Button} rightIcon={<ChevronDownIcon />}
        >  
          Jay Gurav
        </MenuButton>
        <MenuList bg="black.50" border="none"> 
          <MenuItem 
            icon={<AtSignIcon />} 
            _hover={{
              bg:"black.25"
            }} 
          >
            Jay Gurav
          </MenuItem>
          <MenuItem 
            icon={<ExternalLinkIcon />}  
            _hover={{
                bg:"black.25"
              }}  
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
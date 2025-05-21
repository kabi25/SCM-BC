import React from 'react';
import {
  Center,
  Text,
  Link,
  VStack,
  Icon,
  Box,
  Container,
  Flex,
  HStack,
  Divider,
  Image,
  Heading
} from '@chakra-ui/react';
import { 
  InfoIcon, 
  EmailIcon, 
  PhoneIcon, 
  StarIcon 
} from '@chakra-ui/icons';

export default function Footer() {
  return (
    <>
      <Box 
        as="footer" 
        bg="rgba(20, 20, 20, 0.95)" 
        py={10} 
        borderTop="1px solid" 
        borderColor="whiteAlpha.200"
        mt={10}
      >
        <Container maxW="1200px">
          <Flex 
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
          >
            <VStack align={{ base: "center", md: "flex-start" }} mb={{ base: 8, md: 0 }}>
              <HStack spacing={3}>
                <Image 
                  src="plate-fork.png" 
                  borderRadius="lg" 
                  maxW="30px" 
                />
                <Heading 
                  fontSize="lg" 
                  fontWeight="bold"
                  color="whiteAlpha.900"
                >
                  Sharifa Ready to Eat
                </Heading>
              </HStack>
              <Text color="whiteAlpha.700" fontSize="sm" mt={2} maxW="350px">
                A blockchain-based supply chain management system for tracking food products from producer to consumer.
              </Text>
            </VStack>
            
            <VStack align={{ base: "center", md: "flex-end" }} spacing={4}>
              <HStack spacing={4}>
                <Link href="https://github.com" isExternal>
                  <Icon 
                    as={InfoIcon} 
                    boxSize={5} 
                    color="whiteAlpha.700" 
                    _hover={{ color: "white" }}
                    transition="color 0.2s"
                  />
                </Link>
                <Link href="https://twitter.com" isExternal>
                  <Icon 
                    as={EmailIcon} 
                    boxSize={5} 
                    color="whiteAlpha.700" 
                    _hover={{ color: "twitter.400" }}
                    transition="color 0.2s"
                  />
                </Link>
                <Link href="https://linkedin.com" isExternal>
                  <Icon 
                    as={PhoneIcon} 
                    boxSize={5} 
                    color="whiteAlpha.700" 
                    _hover={{ color: "linkedin.400" }}
                    transition="color 0.2s"
                  />
                </Link>
              </HStack>
              
              <Text color="whiteAlpha.600" fontSize="xs">
                © {new Date().getFullYear()} Sharifa Ready to Eat. All rights reserved.
              </Text>
            </VStack>
          </Flex>
          
          <Divider my={6} borderColor="whiteAlpha.200" />
          
          <Center>
            <Text color="whiteAlpha.600" fontSize="xs">
              Made with <Icon as={StarIcon} color="red.400" mx={1} /> using Blockchain Technology
            </Text>
          </Center>
        </Container>
      </Box>
    </>
  );
}

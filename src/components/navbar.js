import React, { useEffect } from 'react';
import {
  Button,
  Center,
  Box,
  Text,
  Flex,
  Link,
  Heading,
  Image,
  HStack,
  useColorModeValue,
  Container,
  Divider,
  useMediaQuery
} from '@chakra-ui/react';
import { ConnectWallet, useAddress, useContract, useContractWrite} from '@thirdweb-dev/react';
import { contractAddress } from '../constants';

export default function Navbar() {
  const address = useAddress();
  const { isLoading, contract } = useContract(contractAddress);
  const [isLargerThanMD] = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    async function fetchData() {
      if(address && !isLoading) // logged in
      {
        const isNewParty = await contract.call('isNewParty', [address])
      }
    }
  
    fetchData();
  }, [address, contract, isLoading]);

  return (
    <>
      <Box 
        as="nav" 
        position="sticky" 
        top="0" 
        zIndex="10" 
        backdropFilter="blur(10px)" 
        bg="rgba(27, 27, 27, 0.8)"
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.3)"
      >
        <Container maxW="1200px" py={3}>
          <Flex align="center" justify="space-between" flexDir={{ base: "column", md: "row" }} py={2}>
            <HStack spacing={3}>
              <Link href="/" _hover={{ textDecoration: 'none' }}>
                <HStack>
                  <Image 
                    src="plate-fork.png" 
                    borderRadius="lg" 
                    maxW="40px" 
                    transition="transform 0.3s"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                  <Heading 
                    fontSize="2xl" 
                    bgGradient="linear(to-r, blue.400, teal.400)" 
                    bgClip="text"
                    fontWeight="bold"
                  >
                    Sharifa Ready to Eat
                  </Heading>
                </HStack>
              </Link>
            </HStack>
            
            <HStack spacing={6} mt={{ base: 4, md: 0 }}>
              <Link 
                href="/" 
                position="relative"
                _hover={{ textDecoration: 'none' }}
              >
                <Text 
                  color="whiteAlpha.800" 
                  fontSize="lg" 
                  fontWeight="medium"
                  transition="all 0.3s"
                  _hover={{ 
                    color: "white",
                    _after: {
                      transform: 'scaleX(1)',
                      transformOrigin: 'left',
                    },
                  }}
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-6px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: 'blue.400',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s',
                    transformOrigin: 'right',
                  }}
                >
                  Home
                </Text>
              </Link>
              
              <Link 
                href="/Dashboard" 
                position="relative"
                _hover={{ textDecoration: 'none' }}
              >
                <Text 
                  color="whiteAlpha.800" 
                  fontSize="lg" 
                  fontWeight="medium"
                  transition="all 0.3s"
                  _hover={{ 
                    color: "white",
                    _after: {
                      transform: 'scaleX(1)',
                      transformOrigin: 'left',
                    },
                  }}
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-6px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: 'blue.400',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s',
                    transformOrigin: 'right',
                  }}
                >
                  Dashboard
                </Text>
              </Link>
              
              <ConnectWallet 
                theme="dark" 
                btnTitle="Connect Wallet"
              />
            </HStack>
          </Flex>
        </Container>
        <Divider borderColor="whiteAlpha.300" />
      </Box>
    </>
  );
}

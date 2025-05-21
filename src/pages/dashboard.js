import React, { useEffect, useState } from 'react';
import {
  Center,
  Card,
  CardBody,
  Box,
  Text,
  Flex,
  VStack,
  Button,
  HStack,
  Heading,
  Progress,
  Input,
  Divider,
  Tabs,
  TabList,
  Tab,
  option,
  TabPanels,
  TabPanel,
  FormLabel,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  Select,
  Container,
  Icon,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import {
  ViewIcon,
  LinkIcon,
  RepeatIcon
} from '@chakra-ui/icons';
import ProductCard from '../components/dashboardproduct.js'

// Panels
import ManageChain from '../components/managechain.js'
import Transaction from '../components/transaction.js'
import ActiveProducts from '../components/activeproducts.js'
import { useAddress, useContract } from '@thirdweb-dev/react';

import { contractAddress } from '../constants.js';

export default function Dashboard() {
  const address = useAddress();
  const { isLoading, contract } = useContract(contractAddress);
  const [products, setProducts] = useState();
  const [party, getParty] = useState();
  const [isChainManager, setIsChainManager] = useState();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if(address && !isLoading) // logged in
      {
        getParty(await contract.call('getParty', [address]));
      }
    }
  
    fetchData();
  }, [address, contract, isLoading]);

  useEffect(() => {
    if(party) setIsChainManager(party[3] == 0)
  }, [party]);

  return (
    <Box bg="blackAlpha.50" minH="calc(100vh - 200px)" py={8}>
      <Container maxW="1400px">
        <VStack spacing={6} align="stretch">
          <Card 
            bg="rgba(13, 16, 25, 0.7)" 
            borderRadius="xl" 
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
            overflow="hidden"
            border="1px solid rgba(255, 255, 255, 0.05)"
          >
            <CardBody p={0}>
              <Flex 
                direction="column" 
                h="100%" 
                bgGradient="linear(to-b, rgba(45, 55, 72, 0.3), transparent)"
              >
                <Box p={6}>
                  <Heading 
                    size="lg" 
                    mb={2} 
                    color="white"
                    fontWeight="700"
                    letterSpacing="tight"
                  >
                    Supply Chain Dashboard
                  </Heading>
                  <Text color="whiteAlpha.700">
                    {party && !isLoading ? (
                      <>
                        Connected as <Badge colorScheme="blue" fontSize="0.8em" ml={1}>{party[1]}</Badge> 
                        {party[3] !== undefined && (
                          <Badge colorScheme={party[3] == 0 ? "red" : "green"} ml={2} fontSize="0.8em">
                            {party[3] == 0 ? "Supply Chain Manager" : "Supply Chain Party"}
                          </Badge>
                        )}
                      </>
                    ) : (
                      "Please connect your wallet to view your dashboard"
                    )}
                  </Text>
                </Box>
                
                <Tabs 
                  variant="enclosed" 
                  colorScheme="blue" 
                  index={tabIndex} 
                  onChange={(index) => setTabIndex(index)}
                  isLazy
                >
                  <TabList 
                    bg="rgba(23, 25, 35, 0.7)" 
                    px={6}
                    borderBottomWidth="1px"
                    borderBottomColor="rgba(255, 255, 255, 0.1)"
                  >
                    <Tab 
                      py={4} 
                      px={5}
                      _selected={{ 
                        color: "white", 
                        borderBottomColor: "blue.400",
                        bg: "rgba(66, 153, 225, 0.1)"
                      }}
                      color="whiteAlpha.700"
                      fontWeight="medium"
                      _hover={{ bg: "whiteAlpha.50" }}
                      transition="all 0.2s"
                      borderBottomWidth="3px"
                      borderBottomColor="transparent"
                      borderRadius="0"
                      mr={2}
                    >
                      <Icon as={ViewIcon} mr={2} />
                      Active Products
                    </Tab>
                    
                    <Tab
                      py={4} 
                      px={5}
                      _selected={{ 
                        color: "white", 
                        borderBottomColor: "blue.400",
                        bg: "rgba(66, 153, 225, 0.1)"
                      }}
                      color="whiteAlpha.700"
                      fontWeight="medium"
                      _hover={{ bg: "whiteAlpha.50" }}
                      transition="all 0.2s"
                      borderBottomWidth="3px"
                      borderBottomColor="transparent"
                      borderRadius="0"
                      mr={2}
                    >
                      <Icon as={LinkIcon} mr={2} />
                      Manage Supply Chain
                    </Tab>
                    
                    <Tab
                      py={4} 
                      px={5}
                      _selected={{ 
                        color: "white", 
                        borderBottomColor: "blue.400",
                        bg: "rgba(66, 153, 225, 0.1)"
                      }}
                      color="whiteAlpha.700"
                      fontWeight="medium"
                      _hover={{ bg: "whiteAlpha.50" }}
                      transition="all 0.2s"
                      borderBottomWidth="3px"
                      borderBottomColor="transparent"
                      borderRadius="0"
                    >
                      <Icon as={RepeatIcon} mr={2} />
                      Make Transaction
                    </Tab>
                  </TabList>
                  
                  <TabPanels p={0}>
                    <TabPanel p={0}>
                      <Box p={6} pt={4}>
                        <ActiveProducts/>
                      </Box>
                    </TabPanel>
                    
                    <TabPanel p={0}>
                      <Box p={6} pt={4}>
                        <ManageChain/>
                      </Box>
                    </TabPanel>
                    
                    <TabPanel p={0}>
                      <Box p={6} pt={4}>
                        <Transaction/>
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}

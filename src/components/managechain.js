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
  Link,
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
  Badge,
  IconButton,
  Tooltip,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Icon,
  Collapse,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack
} from '@chakra-ui/react';
import { 
  AddIcon, 
  ChevronDownIcon, 
  ExternalLinkIcon, 
  SearchIcon, 
  CloseIcon,
  StarIcon,
  ViewIcon,
  SettingsIcon,
  ChatIcon,
  InfoIcon
} from '@chakra-ui/icons';
import { useAddress, useContract } from '@thirdweb-dev/react';
import { contractAddress, STAGE_TO_NUM, NUM_TO_STAGE } from '../constants';

// Function to get icon based on party type
function getPartyIcon(partyType) {
  switch(partyType) {
    case 1: return StarIcon;
    case 2: return SettingsIcon;
    case 3: return InfoIcon;
    case 4: return ViewIcon;
    case 5: return ChatIcon;
    default: return InfoIcon;
  }
}

// Function to get color based on party type
function getPartyColor(partyType) {
  switch(partyType) {
    case 1: return "yellow";
    case 2: return "orange";
    case 3: return "blue";
    case 4: return "purple";
    case 5: return "green";
    default: return "red";
  }
}

function ChainTable({party_name, parties, party_enum}) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredParties = parties?.filter(party => 
      party[1].toLowerCase().includes(searchTerm.toLowerCase()) || 
      party[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
      party[0].toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const color = getPartyColor(party_enum);
    const PartyIcon = getPartyIcon(party_enum);
    
    return (
        <Accordion allowToggle mb={0} borderWidth="0px" borderRadius="lg">
          <AccordionItem border="none">
            <h2>
              <AccordionButton 
                _expanded={{ bg: `${color}.900`, color: 'whiteAlpha.600' }}
                borderRadius="lg"
                _hover={{ bg: 'whiteAlpha.100' }}
                py={3}
                bg="blackAlpha.400"
                color="white"
              >
                <HStack flex='1' textAlign='left' spacing={3}>
                  <Icon as={PartyIcon} boxSize={5} color={`${color}.400`} />
                  <Text fontWeight="semibold" color="white">{party_name}</Text>
                  <Badge colorScheme={color} variant="solid" fontSize="xs">
                    {filteredParties?.length || 0}
                  </Badge>
                </HStack>
                <AccordionIcon color="whiteAlpha.800" />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} px={0} pt={3} bg="blackAlpha.300">
              <InputGroup mb={4} size="sm" mx={4}>
                <InputLeftElement pointerEvents='none'>
                  <SearchIcon color='gray.300' />
                </InputLeftElement>
                <Input 
                  placeholder="Search by name, location or address" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="md"
                  bg="blackAlpha.300"
                />
                {searchTerm && (
                  <IconButton
                    icon={<CloseIcon />}
                    size="sm"
                    aria-label="Clear search"
                    variant="ghost"
                    position="absolute"
                    right="8px"
                    top="4px"
                    onClick={() => setSearchTerm('')}
                  />
                )}
              </InputGroup>

              {filteredParties?.length > 0 ? (
                <TableContainer overflowX="auto">
                  <Table variant='simple' size="sm">
                    <Thead bg="blackAlpha.300">
                      <Tr>
                        <Th color="whiteAlpha.600">Address</Th>
                        <Th color="whiteAlpha.600">Name</Th>
                        <Th color="whiteAlpha.600">Location</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredParties.map((party, index) => (
                        <Tr 
                          key={index}
                          transition="background-color 0.2s"
                          _hover={{ bg: 'blackAlpha.200' }}
                        >
                          <Td>
                            <Tooltip label="View on Etherscan" placement="top">
                              <Link 
                                isExternal 
                                href={`https://sepolia.etherscan.io/address/${party[0].toString()}`}
                                color="blue.300"
                                _hover={{ color: "blue.200" }}
                                display="flex"
                                alignItems="center"
                              >
                                {party[0].toString().substring(0, 8)}...{party[0].toString().substring(party[0].toString().length - 6)}
                                <ExternalLinkIcon mx="2px" />
                              </Link>
                            </Tooltip>
                          </Td>
                          <Td>{party[1]}</Td>
                          <Td>{party[2]}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={4} color="whiteAlpha.600">
                  {searchTerm ? 'No results found' : 'No parties added yet'}
                </Box>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
    );
}

export default function ManageChain() {
    const address = useAddress();
    const { isLoading, contract } = useContract(contractAddress);
    const [parties, setParties] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const { isOpen, onToggle } = useDisclosure();
    const toast = useToast();

    async function fetchData() {
        if(address && !isLoading) // logged in
        {
            try {
              const parties = await contract.call('getAllParties');
              setParties(parties);
            } catch (error) {
              console.error("Error fetching parties:", error);
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 1000);
        
        return () => clearInterval(interval);
    }, [address, contract, isLoading]);

    const validateForm = (data) => {
      const errors = {};
      if (!data.name.trim()) {
        errors.name = "Name is required";
      }
      if (!data.address.trim()) {
        errors.address = "Wallet address is required";
      } else if (!/^0x[a-fA-F0-9]{40}$/.test(data.address)) {
        errors.address = "Invalid Ethereum address format";
      }
      if (!data.location.trim()) {
        errors.location = "Location is required";
      }
      if (!data.type) {
        errors.type = "Party type is required";
      }
      return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        const errors = validateForm(data);
        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          setIsSubmitting(false);
          return;
        }
        
        try {
          await contract.call("createParty", [data.name, data.location, STAGE_TO_NUM.get(data.type), data.address]);
          event.target.reset();
          setFormErrors({});
          onToggle(); // Close the form
          
          toast({
            title: "Party added",
            description: `Successfully added ${data.name} as ${data.type}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } catch (error) {
          toast({
            title: "Error adding party",
            description: error.message || "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsSubmitting(false);
        }
    }

    return (
      <Box>
        <Card 
          variant="filled" 
          bg="blackAlpha.400" 
          borderRadius="xl" 
          mb={8}
          border="1px solid"
          borderColor="whiteAlpha.200"
          overflow="hidden"
        >
          <CardBody p={0}>
            <Flex 
              justify="space-between" 
              align="center" 
              p={4} 
              borderBottom="1px solid"
              borderColor="whiteAlpha.200"
              bg="blackAlpha.200"
            >
              <Heading size="md" fontWeight="600" color="white">
                Supply Chain Parties
              </Heading>
              <Button
                leftIcon={isOpen ? <CloseIcon /> : <AddIcon />}
                size="sm"
                colorScheme={isOpen ? "red" : "blue"}
                onClick={onToggle}
                variant={isOpen ? "outline" : "solid"}
              >
                {isOpen ? "Cancel" : "Add New Party"}
              </Button>
            </Flex>
            
            <Collapse in={isOpen} animateOpacity>
              <Box p={6} bg="blackAlpha.300" borderBottom="1px solid" borderColor="whiteAlpha.100">
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="start">
                    <Stack 
                      direction={{ base: "column", md: "row" }} 
                      w="100%" 
                      spacing={4}
                    >
                      <FormControl isRequired isInvalid={formErrors.type}>
                        <FormLabel color="whiteAlpha.800">Party Type</FormLabel>
                        <Select 
                          name="type" 
                          placeholder="Select type"
                          bg="blackAlpha.300"
                          borderColor="whiteAlpha.300"
                        >
                          <option>Raw Materials</option>
                          <option>Supplier</option>
                          <option>Manufacturer</option>
                          <option>Distributor</option>
                          <option>Consumer</option>
                        </Select>
                        {formErrors.type && (
                          <FormErrorMessage>{formErrors.type}</FormErrorMessage>
                        )}
                      </FormControl>
                      
                      <FormControl isRequired isInvalid={formErrors.name}>
                        <FormLabel color="whiteAlpha.800">Name</FormLabel>
                        <Input 
                          name="name" 
                          placeholder="Enter company name"
                          bg="blackAlpha.300"
                          borderColor="whiteAlpha.300"
                        />
                        {formErrors.name && (
                          <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Stack>
                    
                    <Stack 
                      direction={{ base: "column", md: "row" }} 
                      w="100%" 
                      spacing={4}
                    >
                      <FormControl isRequired isInvalid={formErrors.address}>
                        <FormLabel color="whiteAlpha.800">Wallet Address</FormLabel>
                        <Input 
                          name="address" 
                          placeholder="0x..."
                          bg="blackAlpha.300"
                          borderColor="whiteAlpha.300"
                        />
                        {formErrors.address && (
                          <FormErrorMessage>{formErrors.address}</FormErrorMessage>
                        )}
                      </FormControl>
                      
                      <FormControl isRequired isInvalid={formErrors.location}>
                        <FormLabel color="whiteAlpha.800">Location</FormLabel>
                        <Input 
                          name="location" 
                          placeholder="City, Country"
                          bg="blackAlpha.300"
                          borderColor="whiteAlpha.300"
                        />
                        {formErrors.location && (
                          <FormErrorMessage>{formErrors.location}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Stack>
                    
                    <Button 
                      type="submit"
                      colorScheme="blue" 
                      isLoading={isSubmitting}
                      loadingText="Adding..."
                      width={{ base: "full", md: "auto" }}
                    >
                      Add to Supply Chain
                    </Button>
                  </VStack>
                </form>
              </Box>
            </Collapse>
          </CardBody>
        </Card>

        <Box>
          <Heading size="sm" mb={4} color="whiteAlpha.700">
            Supply Chain Participants by Role
          </Heading>
          
          <Card 
            variant="outlined" 
            bg="blackAlpha.300" 
            mb={4} 
            borderColor="whiteAlpha.100"
            borderRadius="lg"
          >
            <CardBody p={0}>
              <ChainTable 
                party_name="Raw Materials Providers" 
                parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Raw Materials"))}
                party_enum={1}
              />
            </CardBody>
          </Card>
          
          <Card 
            variant="outlined" 
            bg="blackAlpha.300" 
            mb={4} 
            borderColor="whiteAlpha.100"
            borderRadius="lg"
          >
            <CardBody p={0}>
              <ChainTable 
                party_name="Suppliers" 
                parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Supplier"))}
                party_enum={2}
              />
            </CardBody>
          </Card>
          
          <Card 
            variant="outlined" 
            bg="blackAlpha.300" 
            mb={4} 
            borderColor="whiteAlpha.100"
            borderRadius="lg"
          >
            <CardBody p={0}>
              <ChainTable 
                party_name="Manufacturers" 
                parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Manufacturer"))}
                party_enum={3}
              />
            </CardBody>
          </Card>
          
          <Card 
            variant="outlined" 
            bg="blackAlpha.300" 
            mb={4} 
            borderColor="whiteAlpha.100"
            borderRadius="lg"
          >
            <CardBody p={0}>
              <ChainTable 
                party_name="Distributors" 
                parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Distributor"))}
                party_enum={4}
              />
            </CardBody>
          </Card>
          
          <Card 
            variant="outlined" 
            bg="blackAlpha.300" 
            mb={4} 
            borderColor="whiteAlpha.100"
            borderRadius="lg"
          >
            <CardBody p={0}>
              <ChainTable 
                party_name="Consumers" 
                parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Consumer"))}
                party_enum={5}
              />
            </CardBody>
          </Card>
        </Box>
      </Box>
    );
}

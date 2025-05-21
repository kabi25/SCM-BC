import React, { useState, useEffect } from 'react';
import {
  Button,
  Heading,
  Input,
  Divider,
  Textarea,
  FormLabel,
  FormControl,
  VStack,
  Box,
  Text,
  Card,
  CardBody,
  HStack,
  Badge,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Icon,
  Stack,
  Tooltip,
  Grid,
  GridItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select
} from '@chakra-ui/react';
import { 
  InfoIcon, 
  CheckCircleIcon, 
  WarningIcon, 
  RepeatIcon,
  TriangleDownIcon
} from '@chakra-ui/icons';
import { useAddress, useContract, useSDK } from '@thirdweb-dev/react';
import { contractAddress, STAGE, STAGE_TO_NUM, NUM_TO_STAGE } from '../constants';
import web3 from 'web3';

/**
 * 
 * @returns struct Transaction {
        uint id;
        address sender;
        address receiver;
        uint productID;
        uint price;
        string memo;
        uint timestamp;
    }
 */

export default function Transaction() {
  const address = useAddress();
  const sdk = useSDK();
  const { isLoading, contract } = useContract(contractAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionError, setTransactionError] = useState("");
  const toast = useToast();
  
  useEffect(() => {
    async function fetchProducts() {
      if(address && !isLoading) {
        try {
          const allProducts = await contract.call("getAllProducts", [address]);
          setProducts(allProducts || []);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    }
    
    fetchProducts();
    
    const interval = setInterval(() => {
      fetchProducts();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [address, isLoading, contract]);
  
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.receiver.trim()) {
      errors.receiver = "Receiver address is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(data.receiver)) {
      errors.receiver = "Invalid Ethereum address format";
    }
    
    if (!data.productID.trim()) {
      errors.productID = "Product ID is required";
    }
    
    if (!data.price.trim()) {
      errors.price = "Price is required";
    } else if (isNaN(data.price) || parseFloat(data.price) <= 0) {
      errors.price = "Price must be a positive number";
    }
    
    return errors;
  };
  
  const handleProductSelect = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTransactionSuccess(false);
    setTransactionError("");
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
      const res = await contract.call("createTransaction", [
        address, 
        data.receiver, 
        data.productID, 
        web3.utils.toWei(data.price, 'ether'), 
        data.memo || ""
      ]);
      
      if (parseInt(res[0]._hex, 16) === 1) {
        toast({
          title: "Transaction validated",
          description: "Proceeding with ETH transfer",
          status: "info",
          duration: 3000,
        });
        
        try {
          await sdk.wallet.transfer(data.receiver, data.price);
          setTransactionSuccess(true);
          event.target.reset();
          setFormErrors({});
          toast({
            title: "Transaction completed",
            description: `Successfully transferred ${data.price} ETH to ${data.receiver.substring(0, 6)}...${data.receiver.substring(data.receiver.length - 4)}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } catch (transferError) {
          setTransactionError("ETH transfer failed: " + (transferError.message || "Unknown error"));
          toast({
            title: "ETH Transfer failed",
            description: transferError.message || "Unknown error",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        setTransactionError("Transaction not in correct order in the supply chain");
        toast({
          title: "Transaction validation failed",
          description: "Error! Transaction not in correct order in the supply chain!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      setTransactionError(error.message || "Something went wrong");
      toast({
        title: "Transaction failed",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Card 
        bg="blackAlpha.400" 
        borderRadius="xl" 
        mb={6}
        boxShadow="lg"
        borderLeft="4px solid"
        borderLeftColor="blue.400"
      >
        <CardBody>
          <Heading size="md" mb={4} fontWeight="600" color="white">
            <HStack>
              <Icon as={RepeatIcon} color="blue.400" />
              <Text>Create New Transaction</Text>
            </HStack>
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
            <Stat borderRadius="md" p={3} bg="blackAlpha.300">
              <StatLabel color="whiteAlpha.700">Your Wallet</StatLabel>
              <StatNumber fontSize="md" fontWeight="600">
                {address ? 
                  `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 
                  "Not connected"
                }
              </StatNumber>
              <StatHelpText>From Address</StatHelpText>
            </Stat>
            
            <Stat borderRadius="md" p={3} bg="blackAlpha.300">
              <StatLabel color="whiteAlpha.700">Active Products</StatLabel>
              <StatNumber fontSize="md" fontWeight="600">{products?.length || 0}</StatNumber>
              <StatHelpText>Available for Transaction</StatHelpText>
            </Stat>
            
            <Stat borderRadius="md" p={3} bg="blackAlpha.300">
              <StatLabel color="whiteAlpha.700">Network</StatLabel>
              <StatNumber fontSize="md" fontWeight="600">Sepolia Testnet</StatNumber>
              <StatHelpText>Ethereum Test Network</StatHelpText>
            </Stat>
          </SimpleGrid>
          
          {transactionSuccess && (
            <Alert status="success" mb={6} borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Transaction Successful!</AlertTitle>
                <AlertDescription>
                  Your transaction has been processed successfully.
                </AlertDescription>
              </Box>
            </Alert>
          )}
          
          {transactionError && (
            <Alert status="error" mb={6} borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Transaction Failed</AlertTitle>
                <AlertDescription>
                  {transactionError}
                </AlertDescription>
              </Box>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <FormControl isRequired isInvalid={formErrors.receiver}>
                  <FormLabel color="whiteAlpha.800">Receiving Address</FormLabel>
                  <Input 
                    name="receiver" 
                    placeholder="0x..." 
                    bg="blackAlpha.300"
                    borderColor="whiteAlpha.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #63b3ed" }}
                  />
                  {formErrors.receiver && (
                    <FormErrorMessage>{formErrors.receiver}</FormErrorMessage>
                  )}
                </FormControl>
                
                <FormControl isRequired isInvalid={formErrors.productID}>
                  <FormLabel color="whiteAlpha.800">Product ID</FormLabel>
                  {products && products.length > 0 ? (
                    <Select 
                      name="productID" 
                      placeholder="Select product" 
                      onChange={handleProductSelect}
                      bg="blackAlpha.300"
                      borderColor="whiteAlpha.300"
                      icon={<TriangleDownIcon />}
                    >
                      {products.map((product, index) => (
                        <option key={index} value={product[0]._hex}>
                          {product[2]} (ID: {product[0]._hex})
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input 
                      name="productID" 
                      placeholder="Enter Product ID"
                      bg="blackAlpha.300"
                      borderColor="whiteAlpha.300"
                    />
                  )}
                  {formErrors.productID && (
                    <FormErrorMessage>{formErrors.productID}</FormErrorMessage>
                  )}
                </FormControl>
              </SimpleGrid>
              
              <FormControl isRequired isInvalid={formErrors.price}>
                <FormLabel color="whiteAlpha.800">Price (ETH)</FormLabel>
                <InputGroup>
                  <InputLeftAddon 
                    children="ETH" 
                    bg="blue.600" 
                    color="white" 
                    borderColor="blue.600"
                  />
                  <Input 
                    name="price" 
                    type="number" 
                    step="0.001"
                    placeholder="0.00" 
                    bg="blackAlpha.300"
                    borderColor="whiteAlpha.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #63b3ed" }}
                  />
                  <InputRightElement width="4.5rem">
                    <Text fontSize="sm" color="whiteAlpha.700">ETH</Text>
                  </InputRightElement>
                </InputGroup>
                {formErrors.price && (
                  <FormErrorMessage>{formErrors.price}</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl>
                <FormLabel color="whiteAlpha.800">Memo (Optional)</FormLabel>
                <Textarea 
                  name="memo" 
                  placeholder="Add notes about this transaction"
                  bg="blackAlpha.300"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #63b3ed" }}
                  minH="100px"
                />
              </FormControl>
              
              <Button
                mt={4}
                colorScheme="blue"
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                loadingText="Processing"
                leftIcon={<Icon as={RepeatIcon} />}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                Confirm Transaction
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
      
      <Alert status="info" variant="subtle" borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontSize="sm">
            All transactions are recorded on the Sepolia Ethereum test network. Make sure the receiving party is registered in your supply chain.
          </Text>
        </Box>
      </Alert>
    </Box>
  );
}

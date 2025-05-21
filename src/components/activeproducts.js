import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Input,
  Divider,
  FormLabel,
  FormControl,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputLeftAddon,
  Icon,
  Flex
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ProductCard from '../components/dashboardproduct.js'
import { Web3Button } from "@thirdweb-dev/react";
import { NUM_TO_STAGE } from '../constants.js'

// Panels
import { useAddress, useContract} from '@thirdweb-dev/react';

import { contractAddress } from '../constants.js';

export default function ActiveProducts() {
  
  const address = useAddress();
  const { contract, isLoading } = useContract(contractAddress);
  const [products, setProducts] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const toast = useToast();

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = "Product name is required";
    }
    if (!data.quantity || isNaN(data.quantity) || parseInt(data.quantity) <= 0) {
      errors.quantity = "Quantity must be a positive number";
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
      await contract.call("createProduct", [address, data.name, data.quantity]);
      event.target.reset();
      setFormErrors({});
      toast({
        title: "Product created",
        description: `Successfully created product: ${data.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error creating product",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function fetchData() {
    if(address && !isLoading) // logged in
    {
      setProducts(await contract.call("getAllProducts", [address]));
    }
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 250);

  }, [address, contract, isLoading]);
  
  return (
    <>
      <Box maxW="1200px" mx="auto" px={4} py={8} fontSize="xl">
        <Card 
          variant="filled" 
          bg="blackAlpha.400" 
          borderRadius="xl" 
          mb={10} 
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
          borderLeft="4px solid blue.400"
        >
          <CardBody py={6}>
            <Heading as="h2" size="md" mb={4} fontWeight="600" color="white">
              Add New Product
            </Heading>
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="start">
                <Flex 
                  direction={{ base: "column", md: "row" }} 
                  w="100%" 
                  gap={4}
                >
                  <FormControl isRequired isInvalid={formErrors.name}>
                    <FormLabel color="whiteAlpha.800">Product Name</FormLabel>
                    <Input 
                      name="name" 
                      placeholder="Enter product name"
                      bg="blackAlpha.300"
                      borderColor="whiteAlpha.300"
                      _hover={{ borderColor: "blue.300" }}
                      _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #63b3ed" }}
                    />
                    {formErrors.name && (
                      <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={formErrors.quantity}>
                    <FormLabel color="whiteAlpha.800">Quantity</FormLabel>
                    <InputGroup>
                      <InputLeftAddon 
                        children="Qty" 
                        bg="blue.600" 
                        color="white" 
                        borderColor="blue.600"
                      />
                      <Input 
                        name="quantity" 
                        type="number" 
                        placeholder="Enter quantity"
                        bg="blackAlpha.300"
                        borderColor="whiteAlpha.300"
                        _hover={{ borderColor: "blue.300" }}
                        _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #63b3ed" }}
                      />
                    </InputGroup>
                    {formErrors.quantity && (
                      <FormErrorMessage>{formErrors.quantity}</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>
                
                <Button 
                  type="submit"
                  colorScheme="blue" 
                  size="md"
                  isLoading={isSubmitting}
                  loadingText="Creating..."
                  leftIcon={<AddIcon />}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Create Product
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {products && products.length > 0 ? (
          <>
            <Heading as="h2" size="lg" mb={6} fontWeight="700" color="white">
              Your Products
            </Heading>
            
            {products.map((product, index) => { 
              let partyName = product[6] + " (" + product[5] + ")";
              return (
                <ProductCard 
                  key={index}
                  name={product[2]} 
                  id={product[0]._hex} 
                  stage={NUM_TO_STAGE.get(product[1])} 
                  party={partyName} 
                  progress={product[1] * 25}
                />
              );
            })}
          </>
        ) : (
          address && !isLoading && (
            <Box textAlign="center" py={10} color="whiteAlpha.700">
              <Text fontSize="xl">No products found. Create one to get started!</Text>
            </Box>
          )
        )}
      </Box>
    </>
  );
}

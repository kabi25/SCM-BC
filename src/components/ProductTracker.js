import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Badge,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useContract, useContractRead } from '@thirdweb-dev/react';
import { contractAddress } from '../constants';

const ProductTracker = () => {
  const [productId, setProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { contract } = useContract(contractAddress);
  const { data: productData, isLoading: isProductLoading } = useContractRead(
    contract,
    'getProductHistory',
    [productId]
  );

  const handleTrack = async () => {
    if (!productId) {
      toast({
        title: 'Error',
        description: 'Please enter a product ID',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // The contract read will automatically update the productData
      toast({
        title: 'Success',
        description: 'Product history retrieved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to retrieve product history',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProductHistory = () => {
    if (!productData) return null;

    return (
      <VStack spacing={4} align="stretch" mt={4}>
        <Heading size="md">Product History</Heading>
        <Divider />
        {productData.map((event, index) => (
          <Card key={index} variant="outline">
            <CardBody>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{event.type}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(event.timestamp * 1000).toLocaleString()}
                  </Text>
                </VStack>
                <Badge colorScheme={event.status === 'completed' ? 'green' : 'blue'}>
                  {event.status}
                </Badge>
              </HStack>
              <Text mt={2}>{event.description}</Text>
            </CardBody>
          </Card>
        ))}
      </VStack>
    );
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Track Product</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4}>
          <Box w="full">
            <Text mb={2}>Enter Product ID</Text>
            <HStack>
              <Input
                placeholder="Enter product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
              <Button
                colorScheme="blue"
                onClick={handleTrack}
                isLoading={isLoading || isProductLoading}
              >
                Track
              </Button>
            </HStack>
          </Box>
          {renderProductHistory()}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ProductTracker; 
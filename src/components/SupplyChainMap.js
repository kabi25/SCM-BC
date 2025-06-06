import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaWarehouse, FaTruck, FaStore, FaCheckCircle } from 'react-icons/fa';

const SupplyChainNode = ({ icon, title, status, isActive }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = isActive ? 'blue.500' : 'gray.200';

  return (
    <VStack
      p={4}
      bg={bgColor}
      rounded="lg"
      border="2px solid"
      borderColor={borderColor}
      spacing={2}
      minW="200px"
    >
      <Icon as={icon} w={8} h={8} color={isActive ? 'blue.500' : 'gray.400'} />
      <Text fontWeight="bold">{title}</Text>
      <Text fontSize="sm" color={isActive ? 'blue.500' : 'gray.500'}>
        {status}
      </Text>
    </VStack>
  );
};

const SupplyChainMap = ({ productData }) => {
  // This would typically come from your blockchain data
  const mockData = {
    manufacturer: { status: 'Completed', isActive: true },
    distributor: { status: 'In Transit', isActive: true },
    warehouse: { status: 'Pending', isActive: false },
    retailer: { status: 'Pending', isActive: false },
  };

  return (
    <Card>
      <CardBody>
        <VStack spacing={8}>
          <Heading size="md">Supply Chain Journey</Heading>
          
          <HStack spacing={4} justify="center" wrap="wrap">
            <SupplyChainNode
              icon={FaWarehouse}
              title="Manufacturer"
              status={mockData.manufacturer.status}
              isActive={mockData.manufacturer.isActive}
            />
            <Box
              w="50px"
              h="2px"
              bg={mockData.distributor.isActive ? 'blue.500' : 'gray.200'}
            />
            <SupplyChainNode
              icon={FaTruck}
              title="Distributor"
              status={mockData.distributor.status}
              isActive={mockData.distributor.isActive}
            />
            <Box
              w="50px"
              h="2px"
              bg={mockData.warehouse.isActive ? 'blue.500' : 'gray.200'}
            />
            <SupplyChainNode
              icon={FaStore}
              title="Warehouse"
              status={mockData.warehouse.status}
              isActive={mockData.warehouse.isActive}
            />
            <Box
              w="50px"
              h="2px"
              bg={mockData.retailer.isActive ? 'blue.500' : 'gray.200'}
            />
            <SupplyChainNode
              icon={FaCheckCircle}
              title="Retailer"
              status={mockData.retailer.status}
              isActive={mockData.retailer.isActive}
            />
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default SupplyChainMap; 
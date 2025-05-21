import React from 'react';
import {
  Text,
  Flex,
  Card,
  CardBody,
  VStack,
  Progress,
  Button,
  Link,
  Badge,
  Box,
  HStack,
  Heading,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function ProductCard({name, id, stage, party, progress}) {
  const trackingRoute = "/track/" + id;
  
  // Define colors for different stages
  const stageColors = {
    "Raw Materials": "yellow",
    "Supplier": "orange",
    "Manufacturer": "blue",
    "Distributor": "purple",
    "Consumer": "green",
    "Supply Chain Manager": "red"
  };

  // Get color based on stage
  const stageColor = stageColors[stage] || "gray";

  return (
    <Card 
      mx="10px" 
      my="20px" 
      overflow='hidden' 
      variant='elevated' 
      maxW="90%" 
      bgColor="blackAlpha.400" 
      color="white"
      borderRadius="lg"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
      borderLeft={`4px solid ${stageColor}.400`}
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)" }}
    >
      <CardBody p="16px">
        <VStack align="start" spacing={3} w="100%">
          <Flex align="center" justify="space-between" w="100%">
            <Heading size="md" fontWeight="600">{name}</Heading>
            <Badge colorScheme={stageColor} fontSize="0.8em" px={2} py={1} borderRadius="full">{stage}</Badge>
          </Flex>
          
          <HStack spacing={4} fontSize="sm" color="whiteAlpha.800">
            <Text fontWeight="500">ID: <Box as="span" color="whiteAlpha.900">{id}</Box></Text>
            <Text fontWeight="500">
              Party: 
              <Tooltip label="View on Etherscan" placement="top">
                <Link 
                  isExternal 
                  href={"https://sepolia.etherscan.io/address/" + party.toString()}
                  color="blue.300"
                  _hover={{ color: "blue.200", textDecoration: "underline" }}
                  ml={1}
                >
                  {party.toString().substring(0, 6) + "..." + party.toString().substring(party.toString().length - 4)}
                  <ExternalLinkIcon mx="2px" />
                </Link>
              </Tooltip>
            </Text>
          </HStack>
          
          <Box w="100%">
            <Text mb={1} fontSize="sm" fontWeight="medium">Progress</Text>
            <Progress 
              value={progress}
              size="sm" 
              w="100%" 
              borderRadius="full" 
              colorScheme={stageColor}
              bgColor="whiteAlpha.200"
              hasStripe
            />
          </Box>
          
          <Flex w="100%" justify="flex-end" mt={1}>
            <Link href={trackingRoute}>
              <Button 
                size="sm"
                colorScheme="blue" 
                variant="solid"
                _hover={{ transform: "translateY(-2px)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
                leftIcon={<Icon viewBox="0 0 24 24" boxSize={4}>
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                  />
                </Icon>}
              >
                View History
              </Button>
            </Link>
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );
}
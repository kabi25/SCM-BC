import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaShieldAlt, FaRoute, FaFileContract, FaChartLine } from 'react-icons/fa';

const Feature = ({ title, text, icon }) => {
  return (
    <VStack
      p={6}
      bg={useColorModeValue('white', 'gray.800')}
      rounded="xl"
      shadow="lg"
      spacing={4}
      align="start"
    >
      <Icon as={icon} w={10} h={10} color="blue.500" />
      <Heading size="md">{title}</Heading>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </VStack>
  );
};

export default function Home() {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={12}>
        <Box textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
            mb={4}
          >
            Blockchain-Powered Supply Chain Management
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
            Transform your supply chain with transparent, secure, and efficient blockchain technology
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} w="full">
          <Feature
            icon={FaShieldAlt}
            title="Enhanced Security"
            text="Immutable blockchain records ensure data integrity and prevent fraud"
          />
          <Feature
            icon={FaRoute}
            title="Real-time Tracking"
            text="Monitor your entire supply chain with complete visibility"
          />
          <Feature
            icon={FaFileContract}
            title="Smart Contracts"
            text="Automate compliance and documentation with blockchain smart contracts"
          />
          <Feature
            icon={FaChartLine}
            title="Analytics"
            text="Gain insights with comprehensive supply chain analytics"
          />
        </SimpleGrid>

        <Button
          size="lg"
          colorScheme="blue"
          px={8}
          onClick={() => window.location.href = '/dashboard'}
        >
          Get Started
        </Button>
      </VStack>
    </Container>
  );
}
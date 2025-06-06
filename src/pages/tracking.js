import React, { useEffect, useState } from 'react';
import {
  Center,
  Card,
  CardBody,
  Box,
  Text,
  Flex,
  VStack,
  Link,
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
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import ProductTracker from '../components/ProductTracker';

import { useParams } from "react-router-dom"; // This is so we can grab the ID

import { useAddress, useContract } from '@thirdweb-dev/react';

import { contractAddress, NUM_TO_STAGE } from '../constants.js';

/**
struct Transaction {
        uint id;
        address sender;
        address receiver;
        uint productID;
        uint price;
        string memo;
        uint timestamp;
    }
 */

function TransactionCard({id, sender, receiver, sender_role, reciever_role, price, memo, timestamp, sendername, receivername}) {
  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }  
  
  return (
        <>
        <Card mx="10px" my="30px" overflow='hidden' variant='outline' maxW="90%" bgColor="blackAlpha.300" color="white">
            <CardBody mt="-7px">
                <Flex align="center" justify="space-between" w="100%">
                    <VStack align="left">
                        <Text>Transaction ID: {id}</Text>
                        <Text>Sender ({sender_role}): {sendername} (<Link isExternal href={"https://sepolia.etherscan.io/address/" + sender.toString()}>{sender}</Link>)</Text>
                        <Text>Receiver ({reciever_role}): {receivername} (<Link isExternal href={"https://sepolia.etherscan.io/address/" + receiver.toString()}>{receiver}</Link>)</Text>
                        <Text>Timestamp: {timeConverter(timestamp)}</Text>
                    </VStack>
                    <Box m="30px">
                    <Text>Memo: {memo}</Text>
                    </Box>
                </Flex>
            </CardBody>
        </Card>
        </>
    )
}

// Sample location data - In a real app, this would come from your blockchain
const sampleLocations = {
  manufacturer: { lat: 37.7749, lng: -122.4194 }, // San Francisco
  distributor: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  supplier: { lat: 40.7128, lng: -74.0060 }, // New York
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.0902,
  lng: -95.7129, // Center of USA
};

const TrackingPage = () => {
  const address = useAddress();
  const { isLoading, contract } = useContract(contractAddress);
  const [product, setProduct] = useState();
  const [transactionHistory, setTransactionHistory] = useState();
  const [mapPath, setMapPath] = useState([]);
  
  const { id } = useParams(); // grab the product ID

  useEffect(() => {
    async function fetchData() {
      if(address && !isLoading) // logged in
      {
        setTransactionHistory(await contract.call('getTransactionHistory', [id]));
      }
    }
  
    fetchData();
  }, [address, contract, isLoading]);

  useEffect(() => {
    async function fetchData() {
      if(address && !isLoading) // logged in
      {
        setProduct(await contract.call('getProduct', [id]));
      }
    }
  
    fetchData();
  }, [address, contract, isLoading]);

  useEffect(() => {
    console.log(transactionHistory)
  }, [transactionHistory])


  useEffect(() => {
    console.log(product)
  }, [product])

  // This would be replaced with actual data from your blockchain
  useEffect(() => {
    // Sample path for demonstration
    setMapPath([
      sampleLocations.manufacturer,
      sampleLocations.distributor,
      sampleLocations.supplier,
    ]);
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading
        as="h1"
        size="xl"
        bgGradient="linear(to-r, blue.400, blue.600)"
        bgClip="text"
        mb={8}
        textAlign="center"
      >
        Product Tracking
      </Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          rounded="xl"
          shadow="lg"
        >
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={4}
            >
              {mapPath.map((location, index) => (
                <Marker
                  key={index}
                  position={location}
                  label={{
                    text: Object.keys(sampleLocations)[index],
                    color: 'white',
                  }}
                />
              ))}
              <Polyline
                path={mapPath}
                options={{
                  strokeColor: '#3182CE',
                  strokeOpacity: 1.0,
                  strokeWeight: 2,
                }}
              />
            </GoogleMap>
          </LoadScript>
        </Box>

        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          rounded="xl"
          shadow="lg"
        >
          <ProductTracker />
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default TrackingPage;

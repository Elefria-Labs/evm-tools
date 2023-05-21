import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Container,
  Heading,
  Flex,
  Link,
} from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { Links } from '@config/constants';

interface Item {
  title: string;
  description: string;
  link: string;
}

interface ListComponentProps {
  items: Item[];
}

const ListComponent = ({ items }: ListComponentProps) => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {items.map((item: Item, i: number) => (
        <Link key={i} href={item.link}>
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                {item.title}
              </Text>
              <Text>{item.description}</Text>
            </Box>
          </GridItem>
        </Link>
      ))}
    </Grid>
  );
};

export default function Playground() {
  const items: Item[] = [
    {
      title: 'EIP 712',
      description:
        'EIP-712 is a protocol for hashing and signing of typed structured data instead of just bytestrings.',
      link: Links.eip712,
    },
    {
      title: 'ERC 191',
      description:
        'This ERC proposes a specification about how to handle signed data in Ethereum contracts.',
      link: Links.erc191,
    },
    {
      title: 'Transaction Decoder',
      description:
        'A tool that allows users to analyze and decode Ethereum transactions, providing detailed information about the sender, recipient, value, and other parameters, aiding in transaction analysis and debugging.',
      link: Links.txDecoder,
    },
    {
      title: 'Gas Convertor',
      description:
        'The Ethereum Gas Converter is a tool that helps users convert gas units (wei, gwei, eth) to easily understand and estimate the cost of executing transactions and smart contracts on the Ethereum network.',
      link: Links.gasConverter,
    },
    {
      title: 'Bytes & String Convertor',
      description: 'Convert between strings and bytes.',
      link: Links.byteconversion,
    },
    {
      title: 'Deterministic Contracts',
      description:
        'Generate contract addresses for next contract deployment from an address.',
      link: Links.contractAddressGen,
    },
    {
      title: 'ZK Boilerplate',
      description: 'ZK Boileplate dapps using snarkjs and circom',
      link: Links.boilerplate,
    },
  ];

  return (
    <Main
      meta={
        <Meta
          title="Zk Block | Boilerplate for ZK Dapps"
          description="Boilerplate for ZK Dapps | Zero Knowledge Proofs"
        />
      }
    >
      <Container maxW={'container.lg'} position="relative">
        <Heading
          as="h1"
          color="black"
          fontSize={['35px', '35px', '40px']}
          fontWeight={700}
          mb="20px"
          mt="20px"
        >
          Playground
        </Heading>
        <Text
          fontSize={['15px', '15px', '17px']}
          color="gray.700"
          mb="15px"
        ></Text>
      </Container>
      <Flex justify="center">
        <Box width="800px">
          <ListComponent items={items} />
        </Box>
      </Flex>
    </Main>
  );
}

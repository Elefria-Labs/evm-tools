import React from 'react';
import { Box, Container, Divider, Flex, Heading, Text } from '@chakra-ui/react';

import Link from 'next/link';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { Links } from '@config/constants';
import { playgroundToolsList } from '@data/playground';
import { HomeCard } from '@components/home/HomeCard';

const Index = () => {
  return (
    <Main
      meta={
        <Meta
          title="Zk Block | Boilerplate for ZK Dapps"
          description="Boilerplate for ZK Dapps | Zero Knowledge Proofs"
        />
      }
    >
      <Container maxW="container.lg">
        <Box display="flex" flexDirection="column" justifyItems="space-between">
          <Box>
            <Box py={['16px', '16px', '24px']}>
              <Heading
                color="black"
                fontSize={['22px', '22px', '28px']}
                mb={['8px', '8px', '15px']}
              >
                Dev Tools
              </Heading>
              <h1 className="text-slate-50 underline" id="app">
                Hello world!
              </h1>
              <Text fontSize={['14px', '14px', '16px']} mb="10px" color="black">
                <Text fontWeight={500} as="span" color="gray">
                  Dev Tools
                </Text>{' '}
                provides list of tools to help you develop on ethereum and evm
                chains.
              </Text>
              <Flex
                flexDirection="row"
                alignContent="center"
                justifyContent="flex-end"
              >
                <Link
                  aria-label="Go to Playgrounds"
                  href={Links.devTools}
                  passHref
                >
                  View All
                </Link>
              </Flex>
              <Divider my="16px" />
              <div className="mb-8 grid grid-cols-3 gap-4">
                {playgroundToolsList
                  .filter((tool) => tool.isBeta && !tool.onChain)
                  .map((tool) => (
                    <HomeCard {...tool} key={tool.title} glow={tool.isBeta} />
                  ))}
                {playgroundToolsList
                  ?.filter((tool) => !tool.isBeta && !tool.onChain)
                  .slice(5)
                  .map((tool) => (
                    <HomeCard {...tool} key={tool.title} />
                  ))}
              </div>
            </Box>
          </Box>
        </Box>
      </Container>
    </Main>
  );
};

export default Index;

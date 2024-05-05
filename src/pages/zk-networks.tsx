import React, { useState } from 'react';

import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';

import Link from 'next/link';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { BlockchainNetwork } from '@types';
import { GithubIcon } from '@components/icon/github';
import { repoLink } from '@config/constants';
import { networkConfig } from '@config/network';
import { ZkNetworkCard } from '@components/zk-network-card';
import { useWalletConnect } from '@hooks/useWalletConnect';
import { toHex, truncateAddress } from '@utils/wallet';
import { toastOptions } from '@components/common/toast';
import {
  CardTitle,
  CardContent,
  Card,
  CardHeader,
} from '@shadcn-components/ui/card';
import { Button } from '@shadcn-components/ui/button';

const ZkNetwork = () => {
  const [zkNetworks] = useState<Record<string, any>>(networkConfig);
  const toast = useToast();
  const { switchNetwork, connectWallet, disconnect, account, chainId } =
    useWalletConnect();

  const addNetwork = (network?: number) => {
    if (account == null || network == null) {
      toast({
        ...toastOptions,
      });
      return;
    }
    switchNetwork(network);
  };
  return (
    <Main
      meta={
        <Meta
          title="Zk Block | Boilerplate for ZK Dapps"
          description="Boilerplate for ZK Dapps | Zero Knowledge Proofs"
        />
      }
    >
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Container maxW="container.lg">
          <Box
            display="flex"
            flexDirection="column"
            justifyItems="space-between"
          >
            <Box>
              <Box py={['23px', '23px', '35px']}>
                <Heading
                  color="black"
                  fontSize={['22px', '22px', '28px']}
                  mb={['8px', '8px', '15px']}
                >
                  zk networks
                </Heading>

                <Flex
                  flexDirection="row"
                  alignContent="center"
                  justifyContent={'space-between'}
                >
                  <Link
                    aria-label="Go to GitHub page"
                    href={repoLink}
                    passHref
                    legacyBehavior
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      <Icon
                        as={GithubIcon}
                        display="block"
                        transition="color 0.2s"
                        cursor="pointer"
                        color="black"
                        w="10"
                        h="10"
                        _hover={{ color: 'gray.600' }}
                      />
                    </a>
                  </Link>
                  {account && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Current Network</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {chainId && (
                          <p>
                            {`Network: ${
                              networkConfig[toHex(chainId)]?.chainName
                            }`}
                          </p>
                        )}
                        <p>{`Account: ${truncateAddress(account)}`}</p>
                        <p>{`Chain Id: ${chainId ?? 'No Network'}`}</p>
                      </CardContent>
                    </Card>
                  )}
                  <Box ml="8px">
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Box>
                        {!account ? (
                          <Button onClick={connectWallet}>
                            Connect Wallet {account}
                          </Button>
                        ) : (
                          <Button onClick={disconnect}>Disconnect</Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Flex>
              </Box>
              <Divider my="24px" />
              <SimpleGrid
                columns={[1, 2, 3]}
                spacing={['10px', '10px', '15px']}
                mb="48px"
              >
                {Object.values(zkNetworks)
                  .filter((nt: BlockchainNetwork) => nt.isZk)
                  .map((network: BlockchainNetwork) => (
                    <ZkNetworkCard
                      key={network.name}
                      blockchainNetwork={network}
                      onClickAdd={addNetwork}
                    />
                  ))}
              </SimpleGrid>
            </Box>
          </Box>
        </Container>
      </Box>
    </Main>
  );
};

export default ZkNetwork;

import React from 'react';
import {
  Container,
  Heading,
  Text,
  Link,
  List,
  ListItem,
  ListIcon,
  Tag,
  TagLeftIcon,
} from '@chakra-ui/react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { CheckCircleIcon, CopyIcon } from '@chakra-ui/icons';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { toastOptions } from '@components/common/toast';
import { repoLink, zkToosLink } from '@config/constants';

export default function Contribute() {
  const { toast } = useToast();
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
          Contribute ❤️
        </Heading>
        <Text fontSize={['15px', '15px', '17px']} color="gray.700" mb="15px">
          The source code of the boilerplate can be found on Github (links
          below):
        </Text>
        <Text fontSize={['15px', '15px', '17px']} color="gray.700" mb="15px">
          <Link
            alignItems="center"
            fontWeight={600}
            _hover={{ textDecoration: 'none', color: 'grey' }}
            href={repoLink}
          >
            zk-block boilerplate
          </Link>
        </Text>
        <Text fontSize={['15px', '15px', '17px']} color="gray.700" mb="15px">
          <Link
            alignItems="center"
            fontWeight={600}
            _hover={{ textDecoration: 'none', color: 'grey' }}
            href={zkToosLink}
          >
            evm-tools
          </Link>
        </Text>
        <Text fontSize={['15px', '15px', '17px']} color="gray.700" mb="15px">
          You can contribute by:
        </Text>
        <List spacing={3}>
          {[
            'Improving the documentation',
            'Creating an issue if something is broken',
            'Writing tests for the contracts or circuits',
            'Adding sample circuits and the correspoding UI',
            'Suggestion to improve the setup',
            'Add support for Vue.js',
            'Create a UI to explain how ZKP works',
            'Fixing grammar mistakes, typos on the website or the content',
            'Writing a Guide Updating an existing guide',
          ].map((list) => {
            return (
              <ListItem key={list}>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                {list}
              </ListItem>
            );
          })}
          <ListItem key={'donate'}>
            <Tag
              size={'lg'}
              variant="solid"
              colorScheme="teal"
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  `0xD5141c47DEE803D0dD9793fcD5703daF4f750148`,
                );
                toast({
                  ...toastOptions,
                  title: 'Copied!',
                  variant: 'default',
                });
              }}
            >
              {`Donation Address: ${'0xD5141c47DEE803D0dD9793fcD5703daF4f750148'}`}
              <TagLeftIcon boxSize="12px" as={CopyIcon} ml={2} />
            </Tag>
          </ListItem>
        </List>
      </Container>
    </Main>
  );
}

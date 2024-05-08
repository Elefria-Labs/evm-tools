import React from 'react';
import { Divider } from '@chakra-ui/react';

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
      <div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="py-8">
              <h1 className="text-lg font-bold">EVM Tools</h1>
              <p>
                List of tools to help you develop on ethereum and evm chains.
              </p>
              <div className="flex flex-row content-center justify-end">
                <Link
                  aria-label="Go to Playgrounds"
                  href={Links.devTools}
                  passHref
                >
                  View All
                </Link>
              </div>
              <Divider my="16px" />
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
                {playgroundToolsList
                  .filter((tool) => tool.isBeta && !tool.onChain)
                  .map((tool) => (
                    <HomeCard {...tool} key={tool.title} glow={tool.isBeta} />
                  ))}
                {playgroundToolsList
                  ?.filter((tool) => !tool.isBeta && !tool.onChain)
                  .slice(2)
                  .map((tool) => (
                    <HomeCard {...tool} key={tool.title} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;

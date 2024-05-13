import React, { useState } from 'react';
import { Divider } from '@chakra-ui/react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { playgroundToolsList } from '@data/playground';
import { HomeCard } from '@components/home/HomeCard';

const Index = () => {
  const [defaultView] = useState(true);
  const [selectedTool] = useState<string | null>();

  const getToolComponent = (toolLink: string) => {
    const Component = playgroundToolsList.find(
      (tool) => tool.link == toolLink,
    )?.component;
    return <Component />;
  };
  return (
    <Main
      meta={
        <Meta
          title="Evm Tools | Tools for web3, evm and zk"
          description="Tools for web3, evm and zero knowledge proofs"
        />
      }
    >
      <div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="py-8">
              <h1 className="text-lg font-bold">EVM Tools</h1>
              <p>Tools to help you develop on ethereum and other evm chains.</p>
              {/* <div className="flex flex-row content-center justify-end">
                <Link
                  aria-label="Go to Playgrounds"
                  href={Links.devTools}
                  passHref
                >
                  <Button>View All</Button>
                </Link>
              </div> */}
              {/* <ToolSearchComponent
                onSelected={(toolLink: string) => {
                  if (toolLink == 'all') {
                    setDefaultView(true);
                    setSelectedTool(null);
                    return;
                  }
                  if (
                    playgroundToolsList
                      .filter((t) => t.isExternal)
                      .find((t) => t.link == toolLink)
                  ) {
                    setDefaultView(true);
                    setSelectedTool(null);
                    window.open(toolLink, '_blank', 'rel=noopener noreferrer');
                    return;
                  }

                  setDefaultView(false);
                  setSelectedTool(toolLink);
                }}
              /> */}
              <Divider my="16px" />
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
                {defaultView && (
                  <>
                    {playgroundToolsList
                      .filter((tool) => tool.isBeta)
                      .map((tool) => (
                        <HomeCard
                          {...tool}
                          key={tool.title}
                          glow={tool.isBeta}
                        />
                      ))}
                    {playgroundToolsList
                      ?.filter((tool) => !tool.isBeta)
                      .map((tool) => (
                        <HomeCard {...tool} key={tool.title} />
                      ))}
                  </>
                )}
                {selectedTool && getToolComponent(selectedTool)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;

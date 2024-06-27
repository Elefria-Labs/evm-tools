import React, { useState } from 'react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { ToolCategory, playgroundToolsList } from '@data/playground';
import { HomeCard } from '@components/home/HomeCard';
import { ToolSearchComponent } from '@components/common/ToolSearchComponent';

const Index = () => {
  const [defaultView, setDefaultView] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string | null>();

  // TODO Optimize
  const getToolName = (toolLink: string) => {
    return playgroundToolsList.find((tool) => tool.link == toolLink)?.title;
  };

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
              <p className="mb-2">
                Tools to help you develop on ethereum and other evm chains.
              </p>
              {/* <div className="flex flex-row content-center justify-end">
                <Link
                  aria-label="Go to Playgrounds"
                  href={Links.devTools}
                  passHref
                >
                  <Button>View All</Button>
                </Link>
              </div> */}
              <ToolSearchComponent
                onSelected={(selectedTool) => {
                  if (selectedTool.toolLink == 'all') {
                    setDefaultView(true);
                    setSelectedTool(null);
                    return;
                  }
                  if (
                    playgroundToolsList
                      .filter((t) => t.isExternal)
                      .find((t) => t.link == selectedTool.toolLink)
                  ) {
                    setDefaultView(true);
                    setSelectedTool(null);
                    window.open(
                      selectedTool.toolLink,
                      '_blank',
                      'rel=noopener noreferrer',
                    );
                    return;
                  }

                  setDefaultView(false);
                  setSelectedTool(selectedTool.toolLink);
                }}
              />
              <hr className="my-3 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
              {defaultView && (
                <div className="mb-8">
                  {/* <div>
                    <h3 className="my-8 text-xl font-bold">
                      Most Commonly used
                    </h3>
                    <div>
                      {
                        <ToolCarousel
                          playgroundTools={playgroundToolsList.filter(
                            (tool) => tool.commonlyUsed,
                          )}
                        />
                      }
                    </div>
                  </div> */}
                  <>
                    {Object.values(ToolCategory).map((toolCategory, i) => {
                      return (
                        <div key={i}>
                          <h3 className="my-8 text-xl font-bold">
                            {toolCategory}
                          </h3>
                          <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {playgroundToolsList
                              .filter(
                                (tool) =>
                                  tool.category ==
                                  (toolCategory as ToolCategory),
                              )
                              .map((tool) => (
                                <HomeCard
                                  {...tool}
                                  key={tool.title}
                                  glow={tool.isBeta}
                                />
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                </div>
              )}
              {selectedTool && (
                <div>
                  <p className="font-bold text-lg mb-8">
                    {getToolName(selectedTool)}
                  </p>

                  {getToolComponent(selectedTool)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;

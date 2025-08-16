import React, { useState } from 'react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { playgroundToolsList } from '@data/playground';
import { ToolsViewToggle } from '@components/tools-view-toggle';

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
      bannerNotVisible={true}
      searchVisible={false}
    >
      <div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="py-8">
              {/* <div className="flex flex-row justify-center">
                <div>
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
                </div>
              </div> */}
              <hr className="my-3 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
              {defaultView && (
                <ToolsViewToggle
                  tools={playgroundToolsList}
                  onToolSelect={(toolLink) => {
                    if (toolLink === 'all') {
                      setDefaultView(true);
                      setSelectedTool(null);
                      return;
                    }

                    const tool = playgroundToolsList.find(
                      (t) => t.link === toolLink,
                    );
                    if (tool?.isExternal) {
                      window.open(
                        toolLink,
                        '_blank',
                        'rel=noopener noreferrer',
                      );
                      return;
                    }

                    setDefaultView(false);
                    setSelectedTool(toolLink);
                  }}
                />
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

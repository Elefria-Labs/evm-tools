import React, { useEffect, useState } from 'react';
import { playgroundToolsList } from '@data/playground';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn-components/ui/tabs';

type ToolTabsProps = {
  selectTab?: string;
};
export default function ToolTabs(props: ToolTabsProps) {
  const { selectTab } = props;
  const [selectedTab, setSelectedTab] = useState<string>(
    selectTab ?? 'hashing',
  );
  useEffect(() => {
    setSelectedTab(selectTab ?? 'hashing');
  }, [selectTab]);
  const [toolTabs] = useState(
    playgroundToolsList.filter((t) => t?.isOnlyWeb != true),
  );

  const getToolComponent = (toolLink: string) => {
    const Component = playgroundToolsList.find(
      (tool) => tool.link == toolLink,
    )?.component;

    return <Component />;
  };

  return (
    <div className="flex flex-col overflow-y-auto">
      <Tabs defaultValue={selectedTab} value={selectedTab}>
        {/* https://github.com/shadcn-ui/ui/issues/2740 */}
        <TabsList className="w-[464px] overflow-x-auto items-center justify-start">
          {toolTabs.map((t) => (
            <TabsTrigger
              key={t.link}
              value={t.link}
              onClick={() => setSelectedTab(t.link)}
            >
              {t.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* //height: `472px`, // -${56}px -${70}px */}
        <div>
          {toolTabs.map((t) => (
            <TabsContent
              key={t.link}
              value={t.link}
              className=" h-[472px] pb-12 overflow-y-auto overflow-x-hidden"
            >
              {getToolComponent(t.link)}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

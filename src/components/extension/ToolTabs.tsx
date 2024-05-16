import React, { useState } from 'react';
import { playgroundToolsList } from '@data/playground';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn-components/ui/tabs';

export default function ToolTabs() {
  const [toolTabs] = useState(
    playgroundToolsList.filter((t) => t?.isWalletRequired == false),
  );

  const getToolComponent = (toolLink: string) => {
    const Component = playgroundToolsList.find(
      (tool) => tool.link == toolLink,
    )?.component;
    return <Component />;
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Tabs defaultValue="account">
        <TabsList className="w-[464px] overflow-x-scroll">
          {toolTabs.map((t) => (
            <TabsTrigger key={t.link} value={t.link}>
              {t.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* //height: `472px`, // -${56}px -${70}px */}
        <div>
          {toolTabs.map((t) => (
            <TabsContent
              value={t.link}
              className=" h-[472px] pb-4 overflow-y-auto overflow-x-hidden"
              key={t.link}
            >
              {getToolComponent(t.link)}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { playgroundToolsList } from '@data/playground';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn-components/ui/tabs';
import { useGlobalStore } from '@store/global-store';

type ToolTabsProps = {
  selectTab?: string;
};
export default function ToolTabs(props: ToolTabsProps) {
  const { selectTab } = props;
  const lastOpenTab = useGlobalStore.use.lastOpenTab();
  const setLastOpenTab = useGlobalStore.use.setLastOpenTab();

  const [toolTabs] = useState(
    playgroundToolsList.filter((t) => t?.isOnlyWeb != true),
  );

  useEffect(() => {
    if (selectTab != null && selectTab.length > 0) {
      setLastOpenTab(selectTab);
    }
  }, [selectTab, lastOpenTab, setLastOpenTab]);

  const getToolComponent = (toolLink: string) => {
    const Component = playgroundToolsList.find(
      (tool) => tool.link == toolLink,
    )?.component;

    return <Component />;
  };

  return (
    <div className="flex flex-col overflow-y-auto px-0.5 align-middle">
      <Tabs defaultValue={lastOpenTab} value={lastOpenTab}>
        {/* https://github.com/shadcn-ui/ui/issues/2740 */}
        <TabsList className="w-[474px] overflow-x-auto items-center justify-start">
          {toolTabs.map((t) => (
            <TabsTrigger
              key={t.link}
              value={t.link}
              onClick={() => {
                setLastOpenTab(t.link);
              }}
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
              className=" h-[472px] pb-12 px-2 overflow-y-auto overflow-x-hidden"
            >
              {getToolComponent(t.link)}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { playgroundToolsList } from '@data/playground';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn-components/ui/tabs';
import { useGlobalStore } from '@store/global-store';
import { DrawingPinFilledIcon } from '@radix-ui/react-icons';

type ToolTabsProps = {
  selectTab?: string;
};

export default function ToolTabs(props: ToolTabsProps) {
  const { selectTab } = props;
  const [tabHover, setTabHover] = useState<number | null>();
  const lastOpenTab = useGlobalStore.use.lastOpenTab();
  const setLastOpenTab = useGlobalStore.use.setLastOpenTab();
  const pinnedTabs = useGlobalStore.use.pinnedTabs();
  const setPinnedTabs = useGlobalStore.use.setPinnedTabs();

  const [toolTabs] = useState(
    playgroundToolsList.filter(
      (t) => t?.isOnlyWeb !== true || t?.isOnlyExtension === true,
    ),
  );

  useEffect(() => {
    if (selectTab != null && selectTab.length > 0) {
      setLastOpenTab(selectTab);
    }
  }, [selectTab, lastOpenTab, setLastOpenTab]);

  const getToolComponent = (toolLink: string) => {
    const Component = playgroundToolsList.find(
      (tool) => tool.link === toolLink,
    )?.component;

    return Component ? <Component /> : null;
  };

  const handlePinTab = (tab: string) => {
    if (pinnedTabs.includes(tab)) {
      setPinnedTabs(pinnedTabs.filter((t) => t !== tab));
    } else {
      setPinnedTabs([...pinnedTabs, tab]);
    }
  };

  const sortedToolTabs = [
    ...pinnedTabs
      .map((tab) => toolTabs.find((t) => t.link === tab))
      .filter(Boolean),
    ...toolTabs.filter((t) => !pinnedTabs.includes(t.link)),
  ];

  return (
    <div className="flex flex-col overflow-y-auto px-0.5 align-middle custom-scrollbar">
      <Tabs defaultValue={lastOpenTab} value={lastOpenTab}>
        {/* https://github.com/shadcn-ui/ui/issues/2740 */}
        <TabsList className="w-[474px] h-[36px] custom-scrollbar overflow-x-auto overflow-y-hidden items-center justify-start ">
          {sortedToolTabs.map((t, i) => (
            <TabsTrigger
              key={t?.link}
              // TODO fix
              value={t?.link!}
              onClick={() => {
                setLastOpenTab(t?.link!);
              }}
              onMouseEnter={() => {
                setTabHover(i);
              }}
              onMouseLeave={() => setTabHover(null)}
            >
              <div className="relative flex items-center">
                <span>{t?.title}</span>
                <DrawingPinFilledIcon
                  style={{
                    position: 'absolute',
                    top: '8%',
                    right: '-16px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: pinnedTabs.includes(t?.link!) ? 'gold' : 'gray',
                    display:
                      pinnedTabs.includes(t?.link!) || tabHover == i
                        ? 'block'
                        : 'none',
                  }}
                  className="rotate-12 w-4 h-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinTab(t?.link!);
                  }}
                />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <div>
          {sortedToolTabs.map((t) => (
            <TabsContent
              key={t?.link}
              value={t?.link!}
              className="h-[472px] pb-12 px-2 overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
              {getToolComponent(t?.link!)}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

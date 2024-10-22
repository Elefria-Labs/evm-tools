import React, { useState } from 'react';
import ToolTabs from './ToolTabs';
import ToolExtHeader from './ToolExtHeader';
import { ToolSearchComponent } from '@components/common/ToolSearchComponent';
import { Links } from '@config/constants';

export default function ToolExtLayout() {
  const [searchSelectedTool, setSearchSelectedTool] = useState<
    string | undefined
  >();
  return (
    <div className="w-[480px] h-[600px] overflow-y-hidden">
      {/* 56px */}
      <ToolExtHeader />
      <div className="px-2">
        <ToolSearchComponent
          isInExtension
          onSelected={(selectedTool) => {
            if (selectedTool.isExternal) {
              window.open(selectedTool.toolLink, '_blank');
              return;
            }
            if (selectedTool.isOnlyWeb) {
              window.open(`${Links.base}/${selectedTool.toolLink}`, '_blank');
              return;
            }
            if (selectedTool.toolLink == 'all') {
              return;
            }
            setSearchSelectedTool(selectedTool.toolLink);
          }}
        />
      </div>
      <div className="pb-4">
        <ToolTabs selectTab={searchSelectedTool} />
      </div>
    </div>
  );
}

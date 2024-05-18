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
    <div className="h-[600px] overflow-y-hidden">
      {/* 56px */}
      <ToolExtHeader />
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
      <div
        style={{
          padding: '0 8px 8px 8px',
        }}
      >
        {/* <ToolSearchInput /> */}
        <ToolTabs selectTab={searchSelectedTool} />
      </div>
    </div>
  );
}

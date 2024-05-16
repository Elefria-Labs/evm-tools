import React from 'react';
import ToolTabs from './ToolTabs';
import ToolExtHeader from './ToolExtHeader';

export default function ToolExtLayout() {
  return (
    <div className="h-[600px] overflow-y-hidden">
      {/* 56px */}
      <ToolExtHeader />
      <div
        style={{
          padding: '0 8px 8px 8px',
        }}
      >
        {/* <ToolSearchInput /> */}
        <ToolTabs />
      </div>
    </div>
  );
}

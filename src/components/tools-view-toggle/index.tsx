import React, { useState } from 'react';
import { GridView } from './GridView';
import { SideListView } from './SideListView';
import { ToolsViewToggleProps, ViewMode } from './types';

export const ToolsViewToggle: React.FC<ToolsViewToggleProps> = ({
  tools,
  onToolSelect,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div>
      {/* Toggle Button */}
      <div className="flex justify-end mb-6">
        {/* <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-none border-r border-gray-200 dark:border-gray-700"
          >
            <GridIcon className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-none"
          >
            <ListBulletIcon className="h-4 w-4 mr-2" />
            List
          </Button>
        </div> */}
      </div>

      {/* Content based on view mode */}
      {viewMode === 'grid' ? (
        <GridView tools={tools} />
      ) : (
        <SideListView tools={tools} onToolSelect={onToolSelect} />
      )}
    </div>
  );
};

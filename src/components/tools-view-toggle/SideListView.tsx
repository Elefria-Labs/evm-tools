import React, { useState, useMemo } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { Badge } from '@shadcn-components/ui/badge';
import { SideListViewProps } from './types';

export const SideListView: React.FC<SideListViewProps> = ({
  tools,
  onToolSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    return tools
      .filter((tool) => !tool.isOnlyExtension)
      .filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [tools, searchQuery]);

  const handleToolClick = (tool: any) => {
    if (tool.isExternal) {
      window.open(tool.link, '_blank', 'rel=noopener noreferrer');
      return;
    }
    setSelectedTool(tool.link);
    onToolSelect(tool.link);
  };

  const getToolComponent = (toolLink: string) => {
    const tool = tools.find((t) => t.link === toolLink);
    if (!tool?.component) return null;
    const Component = tool.component;
    return <Component />;
  };

  return (
    <div className="flex h-full">
      {/* Left sidebar with search and tool list */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 pr-4">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredTools.map((tool) => (
            <div
              key={tool.title}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                selectedTool === tool.link
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => handleToolClick(tool)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{tool.title}</h4>
                    {tool.isBeta && (
                      <Badge className="py-0.5 px-1 text-xs">New</Badge>
                    )}
                    {tool.isExternal && (
                      <ExternalLinkIcon className="h-3 w-3" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredTools.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tools found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Right content area */}
      <div className="flex-1 pl-4">
        {selectedTool ? (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold">
                {tools.find((t) => t.link === selectedTool)?.title}
              </h2>
            </div>
            {getToolComponent(selectedTool)}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg">Select a tool from the list</p>
              <p className="text-sm mt-2">
                Choose any tool to see it in action
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { ToolCategory } from '@data/playground';
import { HomeCard } from '@components/home/HomeCard';
import { GridViewProps } from './types';

export const GridView: React.FC<GridViewProps> = ({ tools }) => {
  return (
    <div className="mb-8">
      {Object.values(ToolCategory).map((toolCategory, i) => {
        const categoryTools = tools.filter(
          (tool) =>
            tool.category === (toolCategory as ToolCategory) &&
            !tool.isOnlyExtension,
        );

        if (categoryTools.length === 0) return null;

        return (
          <div key={i}>
            <h3 className="my-8 text-xl font-bold">{toolCategory}</h3>
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <HomeCard {...tool} key={tool.title} glow={tool.isBeta} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

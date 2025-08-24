import { Item } from '@data/playground';

export interface ToolsViewToggleProps {
  tools: Item[];
  onToolSelect: (toolLink: string) => void;
}

export type ViewMode = 'grid' | 'list';

export interface GridViewProps {
  tools: Item[];
}

export interface SideListViewProps {
  tools: Item[];
  onToolSelect: (toolLink: string) => void;
}

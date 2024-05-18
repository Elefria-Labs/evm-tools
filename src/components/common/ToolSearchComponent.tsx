'use client';

import { useState } from 'react';
import {
  CaretSortIcon,
  CheckIcon,
  ExternalLinkIcon,
} from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@shadcn-components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@shadcn-components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shadcn-components/ui/popover';
import { playgroundToolsList } from '@data/playground';
import { Label } from '@shadcn-components/ui/label';

type ToolSearchComponentProps = {
  onSelected: (selectedTool: {
    toolLink: string;
    isOnlyWeb?: boolean;
    isExternal?: boolean;
  }) => void;
  isInExtension?: boolean;
};

export function ToolSearchComponent(props: ToolSearchComponentProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('all');

  return (
    <div>
      <Label className="mr-4">Search Tool:</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[240px] justify-between"
          >
            {value != 'all'
              ? playgroundToolsList.find((tool) => tool.link.includes(value))
                  ?.title
              : 'All'}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search tool..." className="h-9" />
            <CommandEmpty>No tool found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                <CommandItem
                  key={'all'}
                  value={'all'}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    props.onSelected({ toolLink: currentValue });
                  }}
                >
                  All
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === 'all' ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
                {playgroundToolsList.map((tool) => (
                  <CommandItem
                    key={tool.link}
                    value={tool.link}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                      props.onSelected({
                        toolLink: currentValue,
                        isOnlyWeb: tool?.isOnlyWeb,
                        isExternal: tool?.isExternal,
                      });
                    }}
                  >
                    {tool.title}
                    {(tool.isExternal ||
                      (props.isInExtension && tool.isOnlyWeb)) && (
                      <ExternalLinkIcon className="ml-2" />
                    )}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === tool.link ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

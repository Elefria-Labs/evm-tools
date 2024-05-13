'use client';

import { useState } from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
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

export function ToolSearchComponent() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          {value
            ? playgroundToolsList.find((tool) => tool.title.includes(value))
                ?.title
            : 'search tools...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {playgroundToolsList.map((tool) => (
                <CommandItem
                  key={tool.link}
                  value={tool.title}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {tool.title}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === tool.title ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

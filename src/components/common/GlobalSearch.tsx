'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { type DialogProps } from '@radix-ui/react-dialog';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@shadcn-components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@shadcn-components/ui/command';
import { playgroundToolsList } from '@data/playground';

interface CommandMenuProps extends DialogProps {
  width?: string;
  height?: string;
}

export function CommandMenu({ width, height, ...props }: CommandMenuProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12',
          width || 'md:w-40 lg:w-54',
          height || '',
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search tools...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tools">
            {playgroundToolsList
              .filter((navItem) => !navItem.isOnlyExtension)
              .map((navItem) => (
                <CommandItem
                  key={navItem.link}
                  value={navItem.title}
                  onSelect={() => {
                    if (navItem.isExternal) {
                      window.open(
                        navItem.link,
                        '_blank',
                        'rel=noopener noreferrer',
                      );
                      return;
                    }
                    runCommand(() => router.push(navItem.link as string));
                  }}
                >
                  {navItem.title}
                  {navItem.isExternal && (
                    <ExternalLinkIcon className="ml-2 h-4 w-4" />
                  )}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

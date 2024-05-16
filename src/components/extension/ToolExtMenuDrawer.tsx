import React from 'react';

import { MinusIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@shadcn-components/ui/dropdown-menu';
import { TwitterIcon } from '@components/icon/twitter';
import { evmToolsXLink } from '@config/constants';

// type ToolExtMenuDrawerProps = {
//   // btnRef: React.MutableRefObject<null>;
//   // isOpen: boolean;
//   // onClose: () => void;
// };
export default function ToolExtMenuDrawer() {
  return (
    <DropdownMenuContent>
      <DropdownMenuLabel>EVM Tools</DropdownMenuLabel>
      <a href="http://evmtools.xyz?ref=ext" target="_blank">
        <DropdownMenuItem className="cursor-pointer">
          EVM Storage Reader
          <span className="ml-2">
            <ExternalLinkIcon />
          </span>
        </DropdownMenuItem>
      </a>
      <DropdownMenuItem>
        <MinusIcon className="h-4 w-4" />
        <span className="sr-only"> Request Feature</span>
      </DropdownMenuItem>
      <DropdownMenuItem>Team</DropdownMenuItem>
      <DropdownMenuSeparator />
      <a href={evmToolsXLink} target="_blank">
        <DropdownMenuItem className="cursor-pointer">
          <p className="mr-2">Follow</p>{' '}
          <TwitterIcon className="ml-2 h-4 w-4" />
        </DropdownMenuItem>
      </a>
    </DropdownMenuContent>
  );
}

import React from 'react';

import { ExternalLinkIcon } from '@radix-ui/react-icons';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@shadcn-components/ui/dropdown-menu';
import { TwitterIcon } from '@components/icon/twitter';
import { evmToolsXLink } from '@config/constants';

export default function ToolExtMenuDrawer() {
  return (
    <DropdownMenuContent>
      <a href="http://evmtools.xyz?ref=ext" target="_blank">
        <DropdownMenuItem className="cursor-pointer">
          EVM Tools Web
          <span className="ml-2">
            <ExternalLinkIcon />
          </span>
        </DropdownMenuItem>
      </a>

      <DropdownMenuItem className="cursor-pointer">
        EVM Storage Reader (coming soon)
      </DropdownMenuItem>

      {/* <FeedbackButton isFloating={false} /> */}

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

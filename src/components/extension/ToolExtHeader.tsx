import React from 'react';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Card, CardContent } from '@shadcn-components/ui/card';
import GasPrice from './GasPrice';
import ToolExtMenuDrawer from './ToolExtMenuDrawer';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@shadcn-components/ui/dropdown-menu';
import { Button } from '@shadcn-components/ui/button';

export default function ToolExtHeader() {
  return (
    <div>
      <Card className="w-full rounded-none">
        <CardContent className="flex flex-row justify-between align-middle items-center py-1">
          {/* TODO component  */}

          <div className="flex flex-row items-center self-start h-[36px]">
            {/* <Image
              alt="evmtools.xyz"
              height="36"
              width="36"
              src="../../../../public/icon-128_2.png"
              style={{ marginRight: '10px' }}
            /> */}
            evmtools
          </div>

          <div className="flex flex-row align-middle">
            <GasPrice />
            <div className="ml-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <HamburgerMenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <ToolExtMenuDrawer />
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

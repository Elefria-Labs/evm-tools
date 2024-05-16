import React from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Card, CardContent } from '@shadcn-components/ui/card';
import GasPrice from './GasPrice';
import ToolExtMenuDrawer from './ToolExtMenuDrawer';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@shadcn-components/ui/dropdown-menu';
import { Button } from '@chakra-ui/react';

export default function ToolExtHeader() {
  return (
    <div>
      <Card className="w-full rounded-none">
        <CardContent
          className="flex justify-items-end py-3"
          style={{ border: '1px solid red' }}
        >
          <GasPrice />
          <div className="ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <HamburgerMenuIcon />
                </Button>
              </DropdownMenuTrigger>
              <ToolExtMenuDrawer />
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shadcn-components/ui/tooltip';
import { Button } from '@shadcn-components/ui/button';

interface InfoTooltipProps {
  text: string;
  text2: string[];
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, text2 }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
            <InfoCircledIcon className="h-4 w-4" />
            <span className="sr-only">Info</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-lg font-bold">{text}</p>
          {text2.map((t, i) => (
            <p key={i} className="text-lg">
              {t}
            </p>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;

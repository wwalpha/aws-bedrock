import * as React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export type WithTooltipProps = {
  trigger: React.ReactNode;
  display: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export function WithTooltip({ trigger, display, side = 'top', align = 'center', className }: WithTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side={side} align={align} className={className}>
          {display}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

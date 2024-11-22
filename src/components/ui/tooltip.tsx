'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(
  (
    props: TooltipPrimitive.TooltipContentProps & {
      className?: string;
      sideOffset?: number;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const baseClasses =
      'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 ' +
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ' +
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 ' +
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';

    const finalClasses = [baseClasses, props.className]
      .filter(Boolean)
      .join(' ');

    return (
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={props.sideOffset ?? 4}
        className={finalClasses}
        {...props}
      />
    );
  }
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

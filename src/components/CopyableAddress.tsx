'use client';

import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyableAddressProps {
  address: string;
  truncateLength?: number;
}

export function CopyableAddress({
  address,
  truncateLength = 8,
}: CopyableAddressProps) {
  const { copy, copied } = useClipboard();

  const truncated = `${address.slice(0, truncateLength)}...${address.slice(-truncateLength)}`;

  return (
    <div className='flex items-center gap-2'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='cursor-help font-mono'>{truncated}</span>
          </TooltipTrigger>
          <TooltipContent className='bg-black/90 text-white px-3 py-1.5 rounded-md text-sm font-mono'>
            {address}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        variant='ghost'
        size='icon'
        className='h-6 w-6 hover:bg-background hover:text-primary'
        onClick={() => copy(address)}
        title='Copy'
      >
        {copied(address) ? (
          <CheckCircle2 className='h-4 w-4 text-green-500' />
        ) : (
          <Copy className='h-4 w-4' />
        )}
      </Button>
    </div>
  );
}

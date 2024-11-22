'use client';

import { Card } from '@/components/ui/card';
import { Clock, Lock, Coins } from 'lucide-react';
import { Allocation } from '@/types/Allocation';

interface AllocationDetailsProps {
  allocation: Allocation;
}

export function AllocationDetails({ allocation }: AllocationDetailsProps) {
  const { name, description, lock, vesting, totalAmount } = allocation;

  return (
    <Card className='p-6'>
      <div className='space-y-6'>
        {/* Title and Description */}
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>{name}</h2>
          <p className='mt-2 text-gray-600 leading-relaxed'>{description}</p>
        </div>

        {/* Lockup and Vesting Periods */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Total Allocation */}
          <div className='flex items-center space-x-3'>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-blue-100'>
              <Coins className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <div className='text-sm text-gray-500'>Total Allocation</div>
              <div className='font-semibold'>
                {totalAmount.toLocaleString()} VOI
              </div>
            </div>
          </div>

          {/* Lockup Period */}
          <div className='flex items-center space-x-3'>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100'>
              <Lock className='w-5 h-5 text-yellow-600' />
            </div>
            <div>
              <div className='text-sm text-gray-500'>Lockup Period</div>
              <div className='font-semibold'>{lock} Months</div>
            </div>
          </div>

          {/* Vesting Period */}
          <div className='flex items-center space-x-3'>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-green-100'>
              <Clock className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <div className='text-sm text-gray-500'>Vesting Period</div>
              <div className='font-semibold'>{vesting} Months</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Allocation } from '@/types/Allocation';
import { MAX_SUPPLY } from '@/config';

interface AllocationCardProps {
  allocation: Allocation;
}

export function AllocationCard({ allocation }: AllocationCardProps) {
  const {
    name,
    slug,
    category,
    totalAmount,
    distributedAmount,
    availableAmount,
  } = allocation;

  // Calculate Total Supply %
  const totalSupplyPercentage = ((totalAmount / MAX_SUPPLY) * 100).toFixed(2);

  // Determine dot color based on Available Amount
  const dotColor = (availableAmount || 0) < 0 ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-xl font-bold'>
            <Link
              href={`/allocation/${slug}`}
              className='hover:underline text-blue-600 dark:text-blue-400'
            >
              {name}
            </Link>
          </h3>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            {category}
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${dotColor}`} />
      </div>

      <div className='space-y-4'>
        {/* Total Allocation */}
        <div>
          <h3 className='text-sm text-gray-500 dark:text-gray-400'>
            Total Allocation
          </h3>
          <p className='font-semibold text-lg dark:text-white'>
            {totalAmount.toLocaleString()} VOI
            <span className='text-sm text-gray-500 dark:text-gray-400 ml-2'>
              ({totalSupplyPercentage}% of Total Supply)
            </span>
          </p>
        </div>

        {/* Distributed Tokens */}
        <div>
          <h3 className='text-sm text-gray-500 dark:text-gray-400'>
            Unlocked Amount
          </h3>
          <p className='font-semibold text-lg dark:text-white'>
            {(distributedAmount || 0).toLocaleString()} VOI
          </p>
        </div>

        {/* Available Balance */}
        <div>
          <h3 className='text-sm text-gray-500 dark:text-gray-400'>
            Available Balance
          </h3>
          <p
            className={`font-semibold text-lg ${
              (availableAmount || 0) < 0
                ? 'text-red-500 dark:text-red-400'
                : 'dark:text-white'
            }`}
          >
            {(availableAmount || 0).toLocaleString()} VOI
          </p>
        </div>
      </div>
    </div>
  );
}

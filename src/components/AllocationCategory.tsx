'use client';

import { Category } from '@/types/Allocation';
import { AllocationCard } from './AllocationCard';
import { MAX_SUPPLY } from '@/config';

interface AllocationCategoryProps {
  category: Category;
}

export function AllocationCategory({ category }: AllocationCategoryProps) {
  // Calculate totals in a single loop
  let totalAllocation = 0;
  let availableSupply = 0;
  let distributedSupply = 0;

  category.allocations.forEach((allocation) => {
    totalAllocation += allocation.totalAmount;
    availableSupply += allocation.availableAmount || 0;
    distributedSupply += allocation.distributedAmount || 0;
  });

  // Calculate the percentage of total allocation relative to MAX_SUPPLY
  const totalAllocationPercentage = (
    (totalAllocation / MAX_SUPPLY) *
    100
  ).toFixed(2);

  return (
    <div className='mb-8'>
      {/* Category Title */}
      <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4'>
        {category.category}
      </h2>

      {/* Summary */}
      <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div>
            <h3 className='text-sm text-gray-500 dark:text-gray-400'>
              Total Allocation
            </h3>
            <p className='font-semibold text-lg text-gray-900 dark:text-gray-100'>
              {totalAllocation.toLocaleString()} VOI
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              ({totalAllocationPercentage}% of Total Supply)
            </p>
          </div>
          <div>
            <h3 className='text-sm text-gray-500 dark:text-gray-400'>
              Available Supply
            </h3>
            <p className='font-semibold text-lg text-gray-900 dark:text-gray-100'>
              {availableSupply.toLocaleString()} VOI
            </p>
          </div>
          <div>
            <h3 className='text-sm text-gray-500 dark:text-gray-400'>
              Unlocked Supply
            </h3>
            <p className='font-semibold text-lg text-gray-900 dark:text-gray-100'>
              {distributedSupply.toLocaleString()} VOI
            </p>
          </div>
        </div>
      </div>

      {/* Allocations */}
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {category.allocations.map((allocation) => (
          <AllocationCard key={allocation.slug} allocation={allocation} />
        ))}
      </div>
    </div>
  );
}

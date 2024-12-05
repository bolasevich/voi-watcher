'use client';

import React, { useEffect, useState } from 'react';
import { Allocation } from '@/types/Allocation';
import { AllocationCard } from './AllocationCard';
import { MAX_SUPPLY, TGE_DATE } from '@/config';
import { calculateTokenProgress } from '@/utils/allocation';
import { useWalletBalances } from '@/hooks/useWalletBalances';

interface AllocationCategoryProps {
  title: string;
  allocations: Allocation[];
}

export function AllocationCategory({
  title,
  allocations,
}: AllocationCategoryProps) {
  const { balances, fetchBalances } = useWalletBalances();
  const [availableBalances, setAvailableBalances] = useState<
    Record<number, number>
  >({});

  // Fetch wallet balances for all allocations
  useEffect(() => {
    const allAddresses = allocations.flatMap((allocation) =>
      allocation.wallets.map((wallet) => wallet.address)
    );
    fetchBalances(allAddresses);
  }, [allocations, fetchBalances]);

  // Calculate available balances for all allocations
  useEffect(() => {
    const calculatedBalances: Record<number, number> = {};
    allocations.forEach((allocation) => {
      const totalWalletBalance = allocation.wallets.reduce(
        (sum, wallet) => sum + (balances[wallet.address]?.balance ?? 0),
        0
      );

      const { availableTokens } = calculateTokenProgress(
        allocation.totalAmount,
        TGE_DATE,
        allocation.lock,
        allocation.vesting,
        allocation.releaseSchedule,
        new Date(),
        allocation.vestingCalculation
      );

      const availableBalance = Math.round(
        availableTokens - (allocation.totalAmount - totalWalletBalance)
      );

      calculatedBalances[allocation.id] = availableBalance;
    });

    setAvailableBalances(calculatedBalances);
  }, [allocations, balances]);

  // Total allocation, available, and percentage
  const totalAllocation = allocations.reduce(
    (sum, allocation) => sum + allocation.totalAmount,
    0
  );

  const totalAvailable = Object.values(availableBalances).reduce(
    (sum, balance) => sum + balance,
    0
  );

  const totalPercentage = ((totalAllocation / MAX_SUPPLY) * 100).toFixed(2);

  return (
    <div className='mb-8'>
      {/* Category Title */}
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>{title}</h2>

      {/* Summary */}
      <div className='bg-gray-50 p-4 rounded-lg shadow-sm mb-6'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {/* Total Allocation */}
          <div>
            <h3 className='text-sm text-gray-500'>Total Allocation</h3>
            <p className='font-semibold text-lg'>
              {totalAllocation.toLocaleString()} VOI
            </p>
          </div>

          {/* Total % */}
          <div>
            <h3 className='text-sm text-gray-500'>Total %</h3>
            <p className='font-semibold text-lg'>{totalPercentage}%</p>
          </div>

          {/* Total Available */}
          <div>
            <h3 className='text-sm text-gray-500'>Total Available</h3>
            <p className='font-semibold text-lg'>
              {totalAvailable.toLocaleString()} VOI
            </p>
          </div>
        </div>
      </div>

      {/* Allocations Grid */}
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {allocations.map((allocation) => (
          <AllocationCard
            key={allocation.id}
            allocation={allocation}
            availableBalance={availableBalances[allocation.id] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}

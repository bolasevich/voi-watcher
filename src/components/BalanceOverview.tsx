'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { CopyableAddress } from '@/components/CopyableAddress';
import { calculateTokenProgress } from '@/utils/allocation';
import { Allocation } from '@/types/Allocation';
import { TGE_DATE } from '@/config';

interface WalletBalance {
  name: string;
  address: string;
  balance: number;
}

interface BalanceOverviewProps {
  allocation: Allocation;
  currentDate?: Date;
}

export function BalanceOverview({
  allocation,
  currentDate = new Date(),
}: BalanceOverviewProps) {
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([]);
  const [isValid, setIsValid] = useState(true);

  const {
    totalAmount,
    lock,
    vesting,
    releaseSchedule,
    vestingCalculation,
    wallets,
  } = allocation;

  const startDate = new Date(TGE_DATE);

  useEffect(() => {
    // Validate TGE_DATE and currentDate
    if (isNaN(startDate.getTime())) {
      console.error('Invalid TGE_DATE configuration:', TGE_DATE);
      setIsValid(false);
      return;
    }

    if (!currentDate || isNaN(currentDate.getTime())) {
      console.error('Invalid currentDate:', currentDate);
      setIsValid(false);
      return;
    }

    // Fetch wallet balances
    async function fetchBalances() {
      try {
        const balances = await Promise.all(
          wallets.map(async (wallet) => {
            const response = await fetch(
              `/api/balance?address=${wallet.address}`
            );
            if (!response.ok) {
              throw new Error(
                `Failed to fetch balance for wallet: ${wallet.address}`
              );
            }
            const { balance } = await response.json();
            return { ...wallet, balance };
          })
        );
        setWalletBalances(balances);
      } catch (error) {
        console.error('Error fetching wallet balances:', error);
        setWalletBalances(wallets.map((wallet) => ({ ...wallet, balance: 0 })));
      }
    }

    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, currentDate]);

  if (!isValid) {
    return <div>Error: Invalid configuration or date.</div>;
  }

  const totalWalletBalance = walletBalances.reduce(
    (sum, wallet) => sum + wallet.balance,
    0
  );

  const { availableTokens } = calculateTokenProgress(
    totalAmount,
    startDate,
    lock,
    vesting,
    releaseSchedule,
    currentDate,
    vestingCalculation
  );

  const availableBalance = Math.max(
    availableTokens - (totalAmount - totalWalletBalance),
    0
  );

  const availablePercentage = Math.round(
    (availableBalance / totalAmount) * 100
  );

  return (
    <Card className='p-6 space-y-6'>
      {/* Main Balances */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h3 className='text-sm text-gray-500 mb-2'>Available Balance</h3>
          <div className='flex items-baseline space-x-2'>
            <p className='text-2xl font-bold'>
              {availableBalance.toLocaleString()} VOI
            </p>
            <span className='text-sm text-gray-500'>
              ({availablePercentage}%)
            </span>
          </div>
        </div>

        <div>
          <h3 className='text-sm text-gray-500 mb-2'>Total Balance</h3>
          <div className='flex items-baseline space-x-2'>
            <p className='text-2xl font-bold'>
              {totalWalletBalance.toLocaleString()} VOI
            </p>
          </div>
        </div>
      </div>

      {/* Associated Wallets */}
      <div className='pt-4 border-t'>
        <h3 className='text-sm text-gray-500 mb-3'>Associated Wallets</h3>
        <div className='grid gap-3'>
          {walletBalances.map((wallet) => (
            <div key={wallet.address} className='bg-gray-50 p-3 rounded-lg'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium'>{wallet.name}</span>
                <span className='text-sm font-semibold'>
                  {wallet.balance.toLocaleString()} VOI
                </span>
              </div>
              <CopyableAddress address={wallet.address} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

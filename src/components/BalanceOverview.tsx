'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CopyableAddress } from '@/components/CopyableAddress';
import { calculateTokenProgress } from '@/utils/allocation';
import { Allocation } from '@/types/Allocation';
import { TGE_DATE } from '@/config';
import { useWalletBalances } from '@/hooks/useWalletBalances';

interface BalanceOverviewProps {
  allocation: Allocation;
}

export function BalanceOverview({ allocation }: BalanceOverviewProps) {
  const {
    totalAmount,
    lock,
    vesting,
    releaseSchedule,
    vestingCalculation,
    wallets,
  } = allocation;

  const { balances, isLoading, error, fetchBalances } = useWalletBalances();

  useEffect(() => {
    const addresses = wallets.map((w) => w.address);
    fetchBalances(addresses);
  }, [wallets, fetchBalances]);

  const walletBalances = wallets.map((wallet) => ({
    ...wallet,
    balance: balances[wallet.address]?.balance ?? 0,
  }));

  const totalWalletBalance = Math.round(
    walletBalances.reduce((sum, wallet) => sum + wallet.balance, 0)
  );

  const { availableTokens } = calculateTokenProgress(
    totalAmount,
    TGE_DATE,
    lock,
    vesting,
    releaseSchedule,
    new Date(),
    vestingCalculation
  );

  const availableBalance = Math.round(
    Math.max(availableTokens - (totalAmount - totalWalletBalance), 0)
  );

  const availablePercentage = Math.round(
    (availableBalance / totalAmount) * 100
  );

  return (
    <Card className='p-6 space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h3 className='text-sm text-muted-foreground mb-2'>
            Available Balance
          </h3>
          <div className='flex items-baseline space-x-2'>
            <p className='text-2xl font-bold'>
              {Math.round(availableBalance).toLocaleString()} VOI
            </p>
            <span className='text-sm text-muted-foreground'>
              ({availablePercentage}%)
            </span>
          </div>
        </div>

        <div>
          <h3 className='text-sm text-muted-foreground mb-2'>Total Balance</h3>
          <div className='flex items-baseline space-x-2'>
            <p className='text-2xl font-bold'>
              {Math.round(totalWalletBalance).toLocaleString()} VOI
            </p>
          </div>
        </div>
      </div>

      <div className='pt-4 border-t border-border'>
        <h3 className='text-sm text-muted-foreground mb-3'>
          Associated Wallets
        </h3>
        <div className='grid gap-3'>
          {error && (
            <div className='text-sm text-destructive mb-2'>
              Error loading balances: {error}
            </div>
          )}
          {walletBalances.map((wallet) => (
            <div key={wallet.address} className='bg-muted p-3 rounded-lg'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium'>{wallet.name}</span>
                <div className='flex items-center'>
                  <span className='text-sm font-semibold'>
                    {isLoading && !balances[wallet.address] ? (
                      <span className='text-muted-foreground'>Loading...</span>
                    ) : (
                      `${Math.round(wallet.balance).toLocaleString()} VOI`
                    )}
                  </span>
                </div>
              </div>
              <CopyableAddress address={wallet.address} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

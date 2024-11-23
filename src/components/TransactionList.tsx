'use client';

import { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { CopyableAddress } from '@/components/CopyableAddress';
import { useWalletTransactions } from '@/hooks/useWalletTransactions';
import { RefreshCw } from 'lucide-react';
import type { Allocation } from '@/types/Allocation';

interface TransactionListProps {
  allocation: Allocation;
}

export function TransactionList({ allocation }: TransactionListProps) {
  const {
    transactions,
    loadingAddresses,
    error,
    fetchTransactionsForAllocation,
  } = useWalletTransactions();
  const [lastUpdated, setLastUpdated] = useState<Date>();

  const allAddresses = useMemo(
    () => allocation.wallets.map((wallet) => wallet.address),
    [allocation.wallets]
  );

  const isLoading = allAddresses.some((address) =>
    loadingAddresses.has(address)
  );

  const allTransactions = useMemo(
    () =>
      allAddresses
        .flatMap((address) => transactions[address] || [])
        .sort((a, b) => b.timestamp - a.timestamp),
    [allAddresses, transactions]
  );

  useEffect(() => {
    fetchTransactionsForAllocation(allAddresses).then(() =>
      setLastUpdated(new Date())
    );
  }, [allAddresses, fetchTransactionsForAllocation]);

  const handleRefresh = async () => {
    await fetchTransactionsForAllocation(allAddresses);
    setLastUpdated(new Date());
  };

  if (isLoading && allTransactions.length === 0) {
    return (
      <Card className='p-6'>
        <p className='text-gray-500'>Loading transactions...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='p-6'>
        <div className='space-y-4'>
          <p className='text-red-500'>{error}</p>
          <button
            onClick={handleRefresh}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            Try again
          </button>
        </div>
      </Card>
    );
  }

  if (allTransactions.length === 0) {
    return (
      <Card className='p-6'>
        <div className='flex justify-between items-center'>
          <p className='text-gray-500'>No transactions found</p>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              isLoading ? 'opacity-50' : ''
            }`}
            title='Refresh transactions'
          >
            <RefreshCw
              className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Recent Transactions</h2>
        <div className='flex items-center gap-4'>
          {lastUpdated && (
            <span className='text-sm text-gray-500'>
              Updated {format(lastUpdated, 'pp')}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              isLoading ? 'opacity-50' : ''
            }`}
            title='Refresh transactions'
          >
            <RefreshCw
              className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='text-left py-3 px-4'>Time</th>
              <th className='text-left py-3 px-4'>Type</th>
              <th className='text-right py-3 px-4'>Amount</th>
              <th className='text-left py-3 px-4'>From</th>
              <th className='text-left py-3 px-4'>To</th>
              <th className='text-left py-3 px-4'>Note</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {allTransactions.map((tx) => (
              <tr key={tx.txId} className='hover:bg-gray-50 transition-colors'>
                <td className='py-3 px-4 whitespace-nowrap'>
                  {format(new Date(tx.timestamp * 1000), 'MMM d, h:mm a')}
                </td>
                <td className='py-3 px-4'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      tx.type === 'received'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tx.type === 'received' ? 'Received' : 'Sent'}
                  </span>
                </td>
                <td
                  className={`py-3 px-4 text-right whitespace-nowrap font-medium
                  ${tx.type === 'received' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {tx.type === 'received' ? '+' : '-'}
                  {tx.amount.toLocaleString()} VOI
                </td>
                <td className='py-3 px-4'>
                  <CopyableAddress address={tx.from} />
                </td>
                <td className='py-3 px-4'>
                  {tx.to && <CopyableAddress address={tx.to} />}
                </td>
                <td className='py-3 px-4 max-w-xs truncate'>
                  {tx.note && (
                    <span title={tx.note} className='cursor-help'>
                      {tx.note}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

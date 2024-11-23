// hooks/useWalletTransactions.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Bottleneck from 'bottleneck';
import type { Transaction } from '@/types/Transaction';
import algosdk from 'algosdk';

const limiter = new Bottleneck({
  minTime: 100,
  maxConcurrent: 1,
});

function decodeNote(
  note: { [key: number]: number } | undefined
): string | undefined {
  if (!note) return undefined;

  try {
    const uint8Array = new Uint8Array(Object.values(note));
    return new TextDecoder().decode(uint8Array);
  } catch (error) {
    console.error('Error decoding note:', error);
    return undefined;
  }
}

function transformTransaction(
  txn: algosdk.indexerModels.Transaction,
  address: string
): Transaction | null {
  if (txn.txType !== 'pay' || !txn.paymentTransaction) {
    return null;
  }

  const isReceived = txn.paymentTransaction.receiver === address;

  try {
    return {
      txId: txn.id || '',
      timestamp: txn.roundTime || 0,
      from: txn.sender,
      to: txn.paymentTransaction.receiver,
      amount: Number(txn.paymentTransaction.amount) / 1e6,
      note: decodeNote(txn.note as { [key: number]: number } | undefined),
      type: isReceived ? 'received' : 'sent',
    };
  } catch {
    return null;
  }
}

interface TransactionsState {
  transactions: Record<string, Transaction[]>;
  loadingAddresses: Set<string>;
  error: string | null;
  fetchTransactionsForAddress: (address: string) => Promise<void>;
  fetchTransactionsForAllocation: (addresses: string[]) => Promise<void>;
}

export const useWalletTransactions = create<TransactionsState>()(
  devtools((set, get) => ({
    // Added 'get' parameter here
    transactions: {},
    loadingAddresses: new Set(),
    error: null,

    fetchTransactionsForAddress: limiter.wrap(async (address: string) => {
      set((state) => ({
        loadingAddresses: new Set([...state.loadingAddresses, address]),
      }));

      try {
        const response = await fetch(`/api/transactions?address=${address}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch transactions');
        }

        const txns =
          (await response.json()) as algosdk.indexerModels.Transaction[];
        const transformedTxns = txns
          .map((txn) => transformTransaction(txn, address))
          .filter((txn): txn is Transaction => txn !== null);

        set((state) => {
          const newLoadingAddresses = new Set(state.loadingAddresses);
          newLoadingAddresses.delete(address);

          return {
            transactions: {
              ...state.transactions,
              [address]: transformedTxns,
            },
            loadingAddresses: newLoadingAddresses,
            error: null,
          };
        });
      } catch (error) {
        set((state) => {
          const newLoadingAddresses = new Set(state.loadingAddresses);
          newLoadingAddresses.delete(address);

          return {
            error:
              error instanceof Error
                ? error.message
                : 'Failed to fetch transactions',
            loadingAddresses: newLoadingAddresses,
          };
        });
      }
    }),

    fetchTransactionsForAllocation: async (addresses: string[]) => {
      const uniqueAddresses = [...new Set(addresses)];
      await Promise.all(
        uniqueAddresses.map((address) =>
          get().fetchTransactionsForAddress(address)
        )
      );
    },
  }))
);

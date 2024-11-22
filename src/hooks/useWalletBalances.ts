// hooks/useWalletBalances.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  WalletBalanceStore,
  WalletBalanceState,
} from '@/types/WalletBalance';
import type { BalanceResponse, ErrorResponse } from '@/types/api';

const initialState: WalletBalanceState = {
  balances: {},
  isLoading: false,
  error: null,
};

export const useWalletBalances = create<WalletBalanceStore>()(
  devtools((set, get) => ({
    ...initialState,

    fetchBalance: async (address: string) => {
      const { balances } = get();
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000;

      if (
        balances[address] &&
        now - balances[address].lastUpdated < CACHE_DURATION
      ) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const response = await fetch(`/api/balance?address=${address}`);
        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponse;
          throw new Error(errorData.error || 'Failed to fetch balance');
        }

        const { balance } = (await response.json()) as BalanceResponse;

        set((state) => ({
          balances: {
            ...state.balances,
            [address]: {
              address,
              balance,
              lastUpdated: now,
            },
          },
          isLoading: false,
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Failed to fetch balance',
          isLoading: false,
        });
      }
    },

    fetchBalances: async (addresses: string[]) => {
      const uniqueAddresses = [...new Set(addresses)];
      await Promise.all(
        uniqueAddresses.map((address) => get().fetchBalance(address))
      );
    },
  }))
);

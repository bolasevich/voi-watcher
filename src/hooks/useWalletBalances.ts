import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getAccountDetails } from '@/utils/blockchain';

interface WalletBalance {
  address: string;
  balance: bigint; // Store balance as bigint to preserve precision
  lastUpdated: number;
}

interface WalletBalanceState {
  balances: Record<string, WalletBalance>;
  isLoading: boolean;
  error: string | null;
}

interface WalletBalanceStore extends WalletBalanceState {
  fetchBalance: (address: string) => Promise<void>;
  fetchBalances: (addresses: string[]) => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useWalletBalances = create<WalletBalanceStore>()(
  devtools((set, get) => ({
    balances: {},
    isLoading: false,
    error: null,

    async fetchBalance(address: string) {
      const { balances } = get();
      const now = Date.now();

      // Use cached balance if it's still valid
      if (
        balances[address] &&
        now - balances[address].lastUpdated < CACHE_DURATION
      ) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        // Fetch account details and extract balance
        const accountInfo = await getAccountDetails(address);
        const balance = accountInfo.amount;

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

    async fetchBalances(addresses: string[]) {
      const uniqueAddresses = [...new Set(addresses)];
      await Promise.all(
        uniqueAddresses.map((address) => get().fetchBalance(address))
      );
    },
  }))
);

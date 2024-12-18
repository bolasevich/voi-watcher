import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Bottleneck from 'bottleneck';

const VOI_DECIMALS = 6;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getApiUrl = (path: string) => {
  const baseUrl =
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : '';
  return `${baseUrl}${path}`;
};

// Create a limiter for API calls
const limiter = new Bottleneck({
  minTime: 100,
  maxConcurrent: 5,
});

interface WalletBalance {
  address: string;
  balance: number;
  lastUpdated: number;
}

interface WalletBalanceState {
  balances: Record<string, WalletBalance>;
  isLoading: boolean;
  error: string | null;
}

// Core fetch function used by both server and client
async function fetchBalanceFromAPI(address: string): Promise<number> {
  const url = getApiUrl(`/api/account?address=${encodeURIComponent(address)}`);
  const response = await fetch(url, {
    // No caching on server, default caching on client
    cache: typeof window === 'undefined' ? 'no-store' : 'default',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch balance');
  }

  const accountInfo = await response.json();
  return Number(accountInfo.amount) / Math.pow(10, VOI_DECIMALS);
}

export const useWalletBalances = create<
  WalletBalanceState & {
    fetchBalance: (address: string) => Promise<WalletBalance>;
    fetchBalances: (
      addresses: string[]
    ) => Promise<Record<string, WalletBalance>>;
  }
>()(
  devtools((set, get) => ({
    balances: {},
    isLoading: false,
    error: null,

    fetchBalance: limiter.wrap(
      async (address: string): Promise<WalletBalance> => {
        // If we're on the server, bypass Zustand entirely
        if (typeof window === 'undefined') {
          const balance = await fetchBalanceFromAPI(address);
          return {
            address,
            balance,
            lastUpdated: Date.now(),
          };
        }

        // Client-side logic with caching
        const { balances } = get();
        const now = Date.now();

        if (
          balances[address] &&
          now - balances[address].lastUpdated < CACHE_DURATION
        ) {
          return balances[address];
        }

        set({ isLoading: true, error: null });

        try {
          const balance = await fetchBalanceFromAPI(address);

          const walletBalance = {
            address,
            balance,
            lastUpdated: now,
          };

          set((state) => ({
            balances: {
              ...state.balances,
              [address]: walletBalance,
            },
            isLoading: false,
          }));

          return walletBalance;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch balance';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      }
    ),

    async fetchBalances(
      addresses: string[]
    ): Promise<Record<string, WalletBalance>> {
      // If we're on the server, fetch all balances directly
      if (typeof window === 'undefined') {
        const results = await Promise.all(
          addresses.map(async (address) => {
            const balance = await fetchBalanceFromAPI(address);
            return [
              address,
              {
                address,
                balance,
                lastUpdated: Date.now(),
              },
            ] as const;
          })
        );
        return Object.fromEntries(results);
      }

      // Client-side logic with caching
      const { balances } = get();
      const now = Date.now();

      const missingOrStale = addresses.filter(
        (address) =>
          !balances[address] ||
          now - balances[address].lastUpdated >= CACHE_DURATION
      );

      if (missingOrStale.length > 0) {
        await Promise.all(
          missingOrStale.map((address) => get().fetchBalance(address))
        );
      }

      return addresses.reduce(
        (result, address) => {
          result[address] = get().balances[address];
          return result;
        },
        {} as Record<string, WalletBalance>
      );
    },
  }))
);

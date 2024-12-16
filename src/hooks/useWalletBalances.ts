import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Bottleneck from 'bottleneck';

// Utility function to construct API URLs
const getApiUrl = (path: string) => {
  if (typeof window === 'undefined') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Default fallback
    return `${baseUrl}${path}`;
  }
  return path;
};

interface WalletBalance {
  address: string;
  balance: number; // Balance in VOI
  lastUpdated: number;
}

interface WalletBalanceState {
  balances: Record<string, WalletBalance>;
  isLoading: boolean;
  error: string | null;
}

interface WalletBalanceStore extends WalletBalanceState {
  fetchBalance: (address: string) => Promise<WalletBalance>;
  fetchBalances: (addresses: string[]) => Promise<Record<string, WalletBalance>>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const VOI_DECIMALS = 6;

// Create a limiter for API calls
const limiter = new Bottleneck({
  minTime: 100, // Minimum time between requests
  maxConcurrent: 5, // Allow up to 5 concurrent requests
});

export const useWalletBalances = create<WalletBalanceStore>()(
  devtools((set, get) => ({
    balances: {},
    isLoading: false,
    error: null,

    // Fetch the balance for a single wallet address
    fetchBalance: limiter.wrap(async (address: string): Promise<WalletBalance> => {
      const { balances } = get();
      const now = Date.now();

      // Check if cached balance is still valid
      if (balances[address] && now - balances[address].lastUpdated < CACHE_DURATION) {
        return balances[address]; // Return cached balance
      }

      set({ isLoading: true, error: null });

      try {
        // Use getApiUrl to construct the API URL
        const url = getApiUrl(`/api/account?address=${encodeURIComponent(address)}`);
        console.log('Fetching URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch balance');
        }

        const accountInfo = await response.json();
        const balance = Number(accountInfo.amount) / Math.pow(10, VOI_DECIMALS);

        // Update state with the new balance
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
        set({ error: error instanceof Error ? error.message : 'Failed to fetch balance', isLoading: false });
        throw error;
      }
    }),

    // Fetch balances for multiple addresses
    async fetchBalances(addresses: string[]): Promise<Record<string, WalletBalance>> {
      const { balances } = get();
      const now = Date.now();

      // Determine addresses that need to be fetched
      const missingOrStale = addresses.filter(
        (address) => !balances[address] || now - balances[address].lastUpdated >= CACHE_DURATION
      );

      // Log debug info
      console.log('Addresses needing fetch:', missingOrStale);

      // Fetch missing or stale balances
      if (missingOrStale.length > 0) {
        await Promise.all(missingOrStale.map((address) => get().fetchBalance(address)));
      }

      // Return the balances for all requested addresses
      const resolvedBalances = addresses.reduce((result, address) => {
        result[address] = get().balances[address];
        return result;
      }, {} as Record<string, WalletBalance>);

      return resolvedBalances;
    },
  }))
);

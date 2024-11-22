export interface WalletBalance {
  address: string;
  balance: number;
  lastUpdated: number;
}

export interface WalletBalanceState {
  balances: Record<string, WalletBalance>;
  isLoading: boolean;
  error: string | null;
}

export interface WalletBalanceActions {
  fetchBalance: (address: string) => Promise<void>;
  fetchBalances: (addresses: string[]) => Promise<void>;
}

export type WalletBalanceStore = WalletBalanceState & WalletBalanceActions;

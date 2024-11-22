// types/api.ts
export type ApiOperation = 'balance' | 'account';

export interface BalanceResponse {
  address: string;
  balance: number;
}

export interface AccountResponse {
  // Define the account info structure from algosdk
  address: string;
  amount: number;
  // Add other fields as needed
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface ApiContext {
  params?: {
    operation?: ApiOperation;
  };
}

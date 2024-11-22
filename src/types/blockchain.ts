export interface AccountInfo {
  address: string;
  amount: bigint;
  // Add other account info properties as needed
}

export interface BlockchainError {
  message: string;
  status: number;
}

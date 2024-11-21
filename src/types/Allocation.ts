export type AllocationCategory = string;

export interface Wallet {
  name: string;
  address: string;
}

export interface Allocation {
  id: number;
  slug: string;
  name: string;
  category: AllocationCategory;
  lock: number; // Lock period in blocks
  vesting: number; // Vesting duration in blocks
  vestingCalculation: string; // Formula for calculating vested amount
  releaseSchedule: number; // Number of blocks per interval
  wallets: Wallet[]; // Array of wallet objects
}

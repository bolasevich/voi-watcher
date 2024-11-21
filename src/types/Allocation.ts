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
  totalAmount: number;
  lock: number; // Lock period in blocks
  vesting: number; // Vesting duration in blocks
  vestingCalculation: string; // Formula for calculating vested amount
  releaseSchedule: string; // Number of blocks per interval
  description: string;
  wallets: Wallet[]; // Array of wallet objects
}

export type AllocationCategory = 'Community' | 'Investors' | 'Block Authority';

export type ReleaseSchedule = 'week' | 'month';

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
  lock: number; // Lock period in months
  vesting: number; // Vesting period in months
  vestingCalculation: string; // Formula for calculating vested amount
  releaseSchedule: ReleaseSchedule; // Must be "week" or "month"
  description: string;
  wallets: Wallet[]; // Array of wallet objects
}

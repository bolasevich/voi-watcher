export type AllocationCategory = 'Community' | 'Block Authority' | 'Purchaser';

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
  lock: number;
  vesting: number;
  vestingCalculation: string;
  releaseSchedule: 'week' | 'month';
  description: string;
  wallets: Wallet[];
}

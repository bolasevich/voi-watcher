export type AllocationCategory = "Community" | "Block Authority" | "Investors";

export interface Allocation {
    name: string;
    category: AllocationCategory;
    lock: number; // Lock period in blocks
    vesting: number; // Vesting duration in blocks
    vestingCalculation: string; // Formula for calculating vested amount
    releaseSchedule: number; // Number of blocks per interval
    wallets: string[];
}

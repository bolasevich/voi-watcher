import { differenceInMonths, differenceInWeeks } from 'date-fns';
import { AllocationData } from '@/types/Allocation';
import { TGE_DATE } from '@/config';
import { useWalletBalances } from '@/hooks/useWalletBalances';

const DEBUG = true; // Set this to false to disable debug logging

/**
 * Conditional logging utility
 */
function logDebug(message: string, ...optionalParams: any[]) {
  if (DEBUG) {
    console.log(message, ...optionalParams);
  }
}

/**
 * Calculate token progress for an allocation based on lock, vesting, and release schedule.
 */
export function calculateTokenProgress(
  totalAmount: number,
  startDate: Date,
  lockMonths: number,
  vestingMonths: number,
  releaseSchedule: 'week' | 'month',
  currentDate: Date,
  vestingCalculation: string
): { availableTokens: number; lockProgress: number; vestingProgress: number } {
  logDebug(`--- Calculating Token Progress for ${totalAmount} tokens ---`);
  logDebug(`Start Date: ${startDate}, Current Date: ${currentDate}`);

  if (currentDate < startDate) {
    logDebug('Current date is before the start date. No tokens available.');
    return { availableTokens: 0, lockProgress: 0, vestingProgress: 0 };
  }

  const unlockDate = new Date(startDate);
  unlockDate.setMonth(unlockDate.getMonth() + lockMonths);

  const vestingEndDate = new Date(unlockDate);
  vestingEndDate.setMonth(vestingEndDate.getMonth() + vestingMonths);

  logDebug(`Unlock Date: ${unlockDate}, Vesting End Date: ${vestingEndDate}`);

  let lockProgress = 0;
  if (currentDate < unlockDate) {
    const elapsedLockTime = currentDate.getTime() - startDate.getTime();
    const totalLockTime = unlockDate.getTime() - startDate.getTime();
    lockProgress = (elapsedLockTime / totalLockTime) * 100;
  } else {
    lockProgress = 100; // Lock is complete
  }
  logDebug(`Lock Progress: ${lockProgress}%`);

  let vestingProgress = 0;
  let availableTokens = 0;

  if (currentDate >= unlockDate && currentDate < vestingEndDate) {
    const elapsedUnits =
      releaseSchedule === 'week'
        ? differenceInWeeks(currentDate, unlockDate)
        : differenceInMonths(currentDate, unlockDate);

    const totalUnits =
      releaseSchedule === 'week'
        ? differenceInWeeks(vestingEndDate, unlockDate)
        : differenceInMonths(vestingEndDate, unlockDate);

    try {
      const elapsedWeeks = elapsedUnits;
      const elapsedMonths = elapsedUnits;
      const totalVestingMonths = totalUnits;

      availableTokens = eval(
        vestingCalculation.replace(
          /totalAmount|elapsedWeeks|elapsedMonths|vestingMonths/g,
          (match) => {
            switch (match) {
              case 'totalAmount':
                return `${totalAmount}`;
              case 'elapsedWeeks':
                return `${elapsedWeeks}`;
              case 'elapsedMonths':
                return `${elapsedMonths}`;
              case 'vestingMonths':
                return `${totalVestingMonths}`;
              default:
                throw new Error(
                  `Unknown variable in vestingCalculation: ${match}`
                );
            }
          }
        )
      );

      vestingProgress = (availableTokens / totalAmount) * 100;
    } catch (error) {
      logDebug('Error evaluating vesting calculation:', error);
    }
  } else if (currentDate >= vestingEndDate) {
    availableTokens = totalAmount;
    vestingProgress = 100;
  }

  logDebug(
    `Available Tokens: ${availableTokens}, Vesting Progress: ${vestingProgress}%`
  );

  return {
    availableTokens,
    lockProgress,
    vestingProgress,
  };
}

export async function processAllocations(
  allocationData: AllocationData
): Promise<AllocationData> {
  const { fetchBalances } = useWalletBalances.getState();

  // Step 1: Calculate distributed amounts for each allocation
  const updatedAllocationData = allocationData.map((category) => {
    const updatedAllocations = category.allocations.map((allocation) => {
      const { availableTokens } = calculateTokenProgress(
        allocation.totalAmount,
        TGE_DATE,
        allocation.lock,
        allocation.vesting,
        allocation.releaseSchedule,
        new Date(),
        allocation.vestingCalculation
      );

      return {
        ...allocation,
        distributedAmount: availableTokens,
        availableAmount: 0, // Placeholder for now
      };
    });

    return { ...category, allocations: updatedAllocations };
  });

  // Step 2: Fetch wallet balances for all unique addresses
  const allWalletAddresses = updatedAllocationData
    .flatMap((category) =>
      category.allocations.flatMap((allocation) =>
        allocation.wallets.map((w) => w.address)
      )
    )
    .filter((address, index, self) => self.indexOf(address) === index); // Ensure unique addresses

  const balances = await fetchBalances(allWalletAddresses);

  // Step 3: Update available amounts using fetched balances
  return updatedAllocationData.map((category) => ({
    ...category,
    allocations: category.allocations.map((allocation) => {
      // Calculate wallet balance
      const walletBalance = allocation.wallets.reduce(
        (sum, wallet) => sum + (balances[wallet.address]?.balance || 0),
        0
      );

      // Calculate Available Balance (allowing negative values for auditing purposes)
      const availableAmount =
        allocation.distributedAmount - (allocation.totalAmount - walletBalance);

      return {
        ...allocation,
        availableAmount,
      };
    }),
  }));
}

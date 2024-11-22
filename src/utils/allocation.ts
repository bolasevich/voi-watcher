import { differenceInMonths, differenceInWeeks } from 'date-fns';

export function calculateTokenProgress(
  totalAmount: number,
  startDate: Date,
  lockMonths: number,
  vestingMonths: number,
  releaseSchedule: 'week' | 'month',
  currentDate: Date,
  vestingCalculation: string
): { availableTokens: number; lockProgress: number; vestingProgress: number } {
  if (currentDate < startDate) {
    console.log('Current date is before the start date. No tokens available.');
    return { availableTokens: 0, lockProgress: 0, vestingProgress: 0 };
  }

  // Calculate unlock date and vesting end date
  const unlockDate = new Date(startDate);
  unlockDate.setMonth(unlockDate.getMonth() + lockMonths);

  const vestingEndDate = new Date(unlockDate);
  vestingEndDate.setMonth(vestingEndDate.getMonth() + vestingMonths);

  // Lock progress: Time-based linear progress during the lock period
  let lockProgress = 0;
  if (currentDate < unlockDate) {
    const elapsedLockTime = currentDate.getTime() - startDate.getTime();
    const totalLockTime = unlockDate.getTime() - startDate.getTime();
    lockProgress = (elapsedLockTime / totalLockTime) * 100;
  } else {
    lockProgress = 100; // Lock is complete
  }

  // Vesting progress: Calculate based on the number of tokens released
  let vestingProgress = 0;
  let availableTokens = 0;

  if (currentDate >= unlockDate && currentDate < vestingEndDate) {
    // Calculate elapsed and total units for vesting
    const elapsedUnits =
      releaseSchedule === 'week'
        ? differenceInWeeks(currentDate, unlockDate)
        : differenceInMonths(currentDate, unlockDate);

    const totalUnits =
      releaseSchedule === 'week'
        ? differenceInWeeks(vestingEndDate, unlockDate)
        : differenceInMonths(vestingEndDate, unlockDate);

    try {
      // Replace variables in the vesting formula
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
      console.error('Error evaluating vesting calculation:', error);
    }
  } else if (currentDate >= vestingEndDate) {
    // Fully vested
    availableTokens = totalAmount;
    vestingProgress = 100;
  }

  // Debugging output
  console.log({
    totalAmount,
    currentDate: currentDate.toISOString(),
    startDate: startDate.toISOString(),
    unlockDate: unlockDate.toISOString(),
    vestingEndDate: vestingEndDate.toISOString(),
    lockMonths,
    vestingMonths,
    releaseSchedule,
    availableTokens,
    lockProgress,
    vestingProgress,
  });

  return {
    availableTokens,
    lockProgress,
    vestingProgress,
  };
}

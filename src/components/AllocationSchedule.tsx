import React from 'react';
import { Card } from '@/components/ui/card';
import { Lock, Timer, Flag, Unlock } from 'lucide-react';
import { Allocation } from '@/types/Allocation';
import { calculateTokenProgress } from '@/utils/allocation';
import { TGE_DATE } from '@/config';

interface AllocationScheduleProps {
  allocation: Allocation;
}

export function AllocationSchedule({ allocation }: AllocationScheduleProps) {
  const { totalAmount, lock, vesting, releaseSchedule, vestingCalculation } =
    allocation;
  const currentDate = new Date();

  const { lockProgress, vestingProgress } = calculateTokenProgress(
    totalAmount,
    TGE_DATE,
    lock,
    vesting,
    releaseSchedule,
    currentDate,
    vestingCalculation
  );

  const hasLockPeriod = lock > 0;
  const hasVestingPeriod = vesting > 0;

  if (!hasLockPeriod && !hasVestingPeriod) {
    return (
      <Card className='p-6'>
        <p className='text-center font-medium'>
          This allocation is fully unlocked.
        </p>
      </Card>
    );
  }

  const startDate = new Date(TGE_DATE);
  const unlockDate = new Date(TGE_DATE);
  unlockDate.setMonth(unlockDate.getMonth() + lock);
  const endDate = new Date(unlockDate);
  endDate.setMonth(endDate.getMonth() + vesting);

  const phase =
    lockProgress < 100
      ? 'locked'
      : vestingProgress < 100
        ? 'vesting'
        : 'complete';

  const points = [
    {
      position: 0,
      label: 'Start',
      icon: <Timer className='w-4 h-4' />,
      isPast: currentDate > startDate,
      date: startDate,
    },
  ];

  if (hasLockPeriod) {
    points.push({
      position: hasVestingPeriod ? (lock / (lock + vesting)) * 100 : 100,
      label: 'Unlock',
      icon:
        lockProgress >= 100 ? (
          <Unlock className='w-4 h-4' />
        ) : (
          <Lock className='w-4 h-4' />
        ),
      isPast: lockProgress >= 100,
      date: unlockDate,
    });
  }

  if (hasVestingPeriod) {
    points.push({
      position: 100,
      label: 'Vesting End',
      icon: <Flag className='w-4 h-4' />,
      isPast: vestingProgress >= 100,
      date: endDate,
    });
  }

  const getStatusBadge = () => {
    switch (phase) {
      case 'locked':
        return hasLockPeriod ? (
          <span className='px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium'>
            Locked
          </span>
        ) : null;
      case 'vesting':
        return (
          <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium'>
            Vesting in Progress
          </span>
        );
      case 'complete':
        return (
          <span className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium'>
            Fully Vested
          </span>
        );
    }
  };

  return (
    <Card className='p-6'>
      <div className='space-y-8'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
          <div>
            <h3 className='text-lg font-semibold'>Release Schedule</h3>
          </div>
          {getStatusBadge()}
        </div>

        <div className='pt-4 pb-20 mx-16'>
          <div className='relative'>
            <div className='h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
              <div className='relative h-full'>
                {hasLockPeriod && (
                  <div
                    className='absolute h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300'
                    style={{
                      width: hasVestingPeriod
                        ? `${(lock / (lock + vesting)) * 100}%`
                        : '100%',
                      clipPath: `inset(0 ${100 - lockProgress}% 0 0)`,
                    }}
                  />
                )}
                {hasVestingPeriod && (
                  <div
                    className='absolute h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300'
                    style={{
                      width: hasLockPeriod
                        ? `${(vesting / (lock + vesting)) * 100}%`
                        : '100%',
                      left: hasLockPeriod
                        ? `${(lock / (lock + vesting)) * 100}%`
                        : '0',
                      clipPath: `inset(0 ${100 - vestingProgress}% 0 0)`,
                    }}
                  />
                )}
              </div>
            </div>

            <div className='absolute w-full' style={{ top: '0.25rem' }}>
              {points.map((point) => (
                <div
                  key={point.label}
                  className='absolute'
                  style={{ left: `${point.position}%` }}
                >
                  <div
                    className={`absolute -translate-y-1/2 transform -translate-x-1/2 inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      point.isPast
                        ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                        : 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    {point.icon}
                  </div>
                  <div className='absolute top-6 left-1/2 -translate-x-1/2 min-w-[120px] text-sm text-center'>
                    <div className='font-medium'>{point.label}</div>
                    <div className='text-gray-500 dark:text-gray-400'>
                      {point.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

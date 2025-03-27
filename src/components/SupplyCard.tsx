import { MAX_SUPPLY } from '@/config';

interface SupplyCardProps {
  title: string;
  amount: number;
  showPercentage?: boolean;
}

export function SupplyCard({
  title,
  amount,
  showPercentage = true,
}: SupplyCardProps) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
      <h2 className='text-lg font-semibold text-gray-600 dark:text-gray-300'>
        {title}
      </h2>
      <div className='text-3xl font-bold mt-2 dark:text-white'>
        {amount.toLocaleString()} {/* Format amount as a number */}
      </div>
      {showPercentage && (
        <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
          {((Number(amount) * 100) / MAX_SUPPLY).toFixed(2)}% of Total Supply
        </div>
      )}
    </div>
  );
}

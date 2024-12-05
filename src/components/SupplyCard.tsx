interface SupplyCardProps {
  title: string;
  amount: bigint;
  totalSupply: bigint;
  showPercentage?: boolean;
}

export function SupplyCard({
  title,
  amount,
  totalSupply,
  showPercentage = true,
}: SupplyCardProps) {
  return (
    <div className='bg-white rounded-xl shadow-lg p-6'>
      <h2 className='text-lg font-semibold text-gray-600'>{title}</h2>
      <div className='text-3xl font-bold mt-2'>
        {amount.toLocaleString()} {/* Format amount as a number */}
      </div>
      {showPercentage && (
        <div className='text-sm text-gray-500 mt-1'>
          {((Number(amount) * 100) / Number(totalSupply)).toFixed(2)}% of Total
          Supply
        </div>
      )}
    </div>
  );
}

import { SupplyCard } from './SupplyCard';
import { MAX_SUPPLY } from '@/config'; // Import the constant directly

interface SupplyOverviewProps {
  distributedSupply: number;
  availableSupply: number;
}

export function SupplyOverview({
  distributedSupply,
  availableSupply,
}: SupplyOverviewProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 dark:text-white'>
      <SupplyCard
        title='Total Supply'
        amount={Number(MAX_SUPPLY)}
        showPercentage={false}
      />
      <SupplyCard title='Unlocked Supply' amount={distributedSupply} />
      <SupplyCard title='Available Supply' amount={availableSupply} />
    </div>
  );
}

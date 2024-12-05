import { SupplyCard } from './SupplyCard';

interface SupplyOverviewProps {
  totalSupply: bigint;
  distributedSupply: bigint;
  availableSupply: bigint;
}

export function SupplyOverview({
  totalSupply,
  distributedSupply,
  availableSupply,
}: SupplyOverviewProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
      <SupplyCard
        title='Total Supply'
        amount={totalSupply}
        totalSupply={totalSupply}
        showPercentage={false}
      />
      <SupplyCard
        title='Distributed Supply'
        amount={distributedSupply}
        totalSupply={totalSupply}
      />
      <SupplyCard
        title='Available Supply'
        amount={availableSupply}
        totalSupply={totalSupply}
      />
    </div>
  );
}

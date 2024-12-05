import { Allocation } from '@/types/Allocation';
import allocationData from '@/data/allocations.json' assert { type: 'json' };
import { SupplyOverview } from '@/components/SupplyOverview';
import { AllocationCategory } from '@/components/AllocationCategory';

export default function HomePage() {
  const allocations = allocationData as Allocation[];

  const totalSupply = BigInt(1_000_000_000); // Example: 1 billion tokens
  const distributedSupply = BigInt(400_000_000); // Example: 400 million tokens
  const availableSupply = BigInt(600_000_000); // Example: 600 million tokens

  // Group allocations by category
  const groupedAllocations = allocations.reduce(
    (groups, allocation) => {
      if (!groups[allocation.category]) {
        groups[allocation.category] = [];
      }
      groups[allocation.category].push(allocation);
      return groups;
    },
    {} as Record<string, Allocation[]>
  );

  return (
    <div>
      {/* Supply Overview */}
      <SupplyOverview
        totalSupply={totalSupply}
        distributedSupply={distributedSupply}
        availableSupply={availableSupply}
      />

      {/* Render Allocation Categories */}
      {Object.entries(groupedAllocations).map(([category, items]) => (
        <AllocationCategory
          key={category}
          title={category}
          allocations={items}
        />
      ))}
    </div>
  );
}

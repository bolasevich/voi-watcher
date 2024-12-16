import allocationData from '@/data/allocations.json' assert { type: 'json' };
import { SupplyOverview } from '@/components/SupplyOverview';
import { AllocationCategory } from '@/components/AllocationCategory';
import { processAllocations } from '@/utils/allocation';
import { AllocationData } from '@/types/Allocation';

export default async function HomePage() {
  // Process allocations to calculate availableAmount and distributedAmount
  const processedCategories = await processAllocations(allocationData as AllocationData);

  // Calculate totals in a single loop
  let totalAvailable = 0;
  let totalDistributed = 0;

  processedCategories.forEach((category) => {
    category.allocations.forEach((allocation) => {
      totalAvailable += allocation.availableAmount || 0;
      totalDistributed += allocation.distributedAmount || 0;
    });
  });

  return (
    <div>
      {/* Supply Overview */}
      <SupplyOverview
        availableSupply={totalAvailable}
        distributedSupply={totalDistributed}
      />

      {/* Render Allocation Categories */}
      {processedCategories.map((category) => (
        <AllocationCategory key={category.category} category={category} />
      ))}
    </div>
  );
}

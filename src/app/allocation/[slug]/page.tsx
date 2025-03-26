import { Allocation, AllocationData } from '@/types/Allocation';
import rawAllocationData from '@/data/allocations.json';
import { AllocationDetails } from '@/components/AllocationDetails';
import { AllocationSchedule } from '@/components/AllocationSchedule';
import { BalanceOverview } from '@/components/BalanceOverview';
import { TransactionList } from '@/components/TransactionList';

// Cast raw JSON data to AllocationData
const allocationData: Allocation[] = (
  rawAllocationData as AllocationData
).flatMap((category) => category.allocations);

function getAllocationBySlug(slug: string): Allocation | undefined {
  return allocationData.find((allocation) => allocation.slug === slug);
}

// Ensure correct type for params
interface PageProps {
  params: Promise<{ slug: string }>; // params is now a Promise
}

export default async function AllocationPage({ params }: PageProps) {
  const { slug } = await params; // Await the params to access slug
  const allocation = getAllocationBySlug(slug);

  if (!allocation) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 dark:text-red-400'>
            Allocation Not Found
          </h1>
          <p className='text-gray-500 dark:text-gray-400'>
            The allocation you&apos;re looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-6'>
          <AllocationDetails allocation={allocation} />
          <AllocationSchedule allocation={allocation} />
          <BalanceOverview allocation={allocation} />
          <TransactionList allocation={allocation} />
        </div>
      </main>
    </div>
  );
}

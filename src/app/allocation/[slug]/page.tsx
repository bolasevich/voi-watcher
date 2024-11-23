import { Allocation } from '@/types/Allocation';
import rawAllocationData from '@/data/allocations.json';
import { AllocationDetails } from '@/components/AllocationDetails';
import { AllocationSchedule } from '@/components/AllocationSchedule';
import { BalanceOverview } from '@/components/BalanceOverview';
import { TransactionList } from '@/components/TransactionList';

const allocationData: Allocation[] = rawAllocationData as Allocation[];

function getAllocationBySlug(slug: string): Allocation | undefined {
  return allocationData.find((allocation) => allocation.slug === slug);
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AllocationPage({ params }: Props) {
  const { slug } = await params; // Await the params to access slug
  const allocation = getAllocationBySlug(slug);

  if (!allocation) {
    return (
      <div>
        <h1 className='text-2xl font-bold text-red-600'>
          Allocation Not Found
        </h1>
        <p>The allocation you&apos;re looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-6'>
          <AllocationDetails allocation={allocation} />
          <AllocationSchedule allocation={allocation} />
          <BalanceOverview allocation={allocation} />
          <TransactionList allocation={allocation} />
          {/* <AllocationDetails
            title={mockData.allocation.title}
            description={mockData.allocation.description}
            wallets={mockData.allocation.wallets}
            allocation={{
              totalAmount: mockData.allocation.totalAmount,
              lockupPeriod: mockData.allocation.lockupPeriod,
              vestingPeriod: mockData.allocation.vestingPeriod,
            }}
          />
          <AllocationSchedule
            lockBlocks={100000}
            vestingBlocks={100000}
            startBlock={100}
            currentBlock={1000}
          />
          <BalanceOverview {...mockData.balances} />
          <TransactionList transactions={transactions} /> */}
        </div>
      </main>
    </div>
  );
}

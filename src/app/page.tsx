import Link from 'next/link';
import { Allocation } from '@/types/Allocation';
import allocationData from '@/data/allocations.json' assert { type: 'json' };

export default function HomePage() {
  // Type assertion to tell TypeScript that the JSON matches our type
  const allocations = allocationData as Allocation[];

  return (
    <div>
      <h1 className='text-3xl font-bold text-purple-600'>
        Allocations Overview
      </h1>
      <p className='text-gray-600 mt-2'>
        Explore all the allocations and their details. Click on an allocation to
        view more information.
      </p>
      <ul className='mt-6 space-y-4'>
        {allocations.map((allocation) => (
          <li
            key={allocation.id}
            className='p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow'
          >
            <h2 className='text-xl font-semibold text-gray-800'>
              <Link
                href={`/allocation/${allocation.slug}`}
                className='hover:underline'
              >
                {allocation.name}
              </Link>
            </h2>
            <p className='text-gray-600'>
              <strong>Category:</strong> {allocation.category}
            </p>
            <p className='text-gray-600'>
              <strong>Lock Period:</strong> {allocation.lock.toLocaleString()}{' '}
              months
            </p>
            <p className='text-gray-600'>
              <strong>Vesting Period:</strong>{' '}
              {allocation.vesting.toLocaleString()} months
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

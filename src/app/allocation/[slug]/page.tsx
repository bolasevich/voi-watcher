import { Allocation } from "@/types/Allocation";
import allocationData from "@/data/allocations.json";

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
                <h1 className="text-2xl font-bold text-red-600">Allocation Not Found</h1>
                <p>The allocation you're looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-purple-600">{allocation.name}</h1>
            <p className="text-gray-600 mt-4">
                <strong>Category:</strong> {allocation.category}
            </p>
            <p className="text-gray-600 mt-2">
                <strong>Lock Period:</strong> {allocation.lock.toLocaleString()} blocks
            </p>
            <p className="text-gray-600 mt-2">
                <strong>Vesting Period:</strong> {allocation.vesting.toLocaleString()} blocks
            </p>
            <p className="text-gray-600 mt-2">
                <strong>Release Schedule:</strong> Every {allocation.releaseSchedule.toLocaleString()} blocks
            </p>
            <p className="text-gray-600 mt-2">
                <strong>Vesting Calculation:</strong> {allocation.vestingCalculation}
            </p>
            <h2 className="text-xl font-semibold mt-6">Wallets</h2>
            <ul className="list-disc pl-6 mt-2">
                {allocation.wallets.map((wallet, index) => (
                    <li key={index} className="text-gray-600">
                        <strong>{wallet.name}:</strong> {wallet.address}
                    </li>
                ))}
            </ul>
        </div>
    );
}

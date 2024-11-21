/**
 * Fetch wallet balance from the blockchain API.
 * @param address - The wallet address to fetch balance for.
 * @returns The balance in Algos.
 */
interface BalanceResponse {
  address: string;
  balance: number;
}

export async function fetchWalletBalance(address: string): Promise<number> {
  try {
    const response = await fetch(`/api/balance?address=${address}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch wallet balance: ${response.statusText}`);
    }
    const data: BalanceResponse = await response.json();
    return data.balance; // Balance in Algos
  } catch (error) {
    console.error(`Error fetching balance for wallet ${address}:`, error);
    return 0; // Default to 0 on error
  }
}

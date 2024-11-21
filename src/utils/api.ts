/**
 * Fetch wallet balance from the blockchain API.
 * @param address - The wallet address to fetch balance for.
 * @returns The balance in Algos.
 */
export async function fetchWalletBalance(address: string): Promise<number> {
  try {
    const response = await fetch(`/api/balance?address=${address}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch wallet balance: ${response.statusText}`);
    }
    const data = await response.json();
    return data.balance; // Balance in Algos
  } catch (error) {
    console.error(`Error fetching balance for wallet ${address}:`, error);
    return 0; // Default to 0 on error
  }
}

/**
 * Fetch detailed account information from the blockchain API.
 * @param address - The wallet address to fetch account details for.
 * @returns Account details object.
 */
export async function fetchAccountDetails(address: string): Promise<any> {
  try {
    const response = await fetch(`/api/account?address=${address}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch account details: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Error fetching account details for wallet ${address}:`,
      error
    );
    return null; // Return null on error
  }
}

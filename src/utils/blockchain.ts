import algosdk from 'algosdk';
import { ALGOD_API_URL, ALGOD_API_TOKEN } from '@/config';

// Create and export the algod client
export const algodClient = new algosdk.Algodv2(
  ALGOD_API_TOKEN,
  ALGOD_API_URL,
  ''
);

/**
 * Fetch the balance of a given wallet address.
 * @param address - The wallet address to fetch balance for.
 * @returns The balance in microVoi.
 */
export async function getWalletBalance(address: string): Promise<number> {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    return Number(accountInfo.amount); // Convert bigint to number
  } catch (error) {
    console.error('Failed to fetch wallet balance:', error);
    throw new Error('Unable to fetch wallet balance.');
  }
}

/**
 * Fetch detailed account information.
 * @param address - The wallet address to fetch account details for.
 * @returns Detailed account information.
 */
export async function getAccountDetails(address: string): Promise<any> {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    return accountInfo;
  } catch (error) {
    console.error('Failed to fetch account details:', error);
    throw new Error('Unable to fetch account details.');
  }
}

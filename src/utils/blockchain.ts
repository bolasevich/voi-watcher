import algosdk from 'algosdk';
import { ALGOD_API_URL, ALGOD_API_TOKEN } from '@/config';

// Create Algodv2 client
export const algodClient = new algosdk.Algodv2(
  ALGOD_API_TOKEN,
  ALGOD_API_URL,
  ''
);

/**
 * Fetches detailed account information for a given address.
 * @param address The Algorand address
 * @returns The account information as `algosdk.modelsv2.Account`
 */
export async function getAccountDetails(
  address: string
): Promise<algosdk.modelsv2.Account> {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    return accountInfo as algosdk.modelsv2.Account;
  } catch (error: unknown) {
    console.error('Failed to fetch account details:', error);
    throw new Error('Unable to fetch account details.');
  }
}

import algosdk from 'algosdk';
import {
  ALGOD_API_URL,
  ALGOD_API_TOKEN,
  INDEXER_API_URL,
  INDEXER_API_TOKEN,
} from '@/config';

export const algodClient = new algosdk.Algodv2(
  ALGOD_API_TOKEN,
  ALGOD_API_URL,
  ''
);

export const indexerClient = new algosdk.Indexer(
  INDEXER_API_TOKEN,
  INDEXER_API_URL,
  ''
);

export async function getAccountDetails(
  address: string
): Promise<algosdk.modelsv2.Account> {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    return accountInfo as algosdk.modelsv2.Account;
  } catch (error: unknown) {
    console.error(
      'Failed to fetch account details:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    throw new Error('Unable to fetch account details.');
  }
}

export async function getWalletTransactions(
  address: string
): Promise<algosdk.indexerModels.Transaction[]> {
  try {
    const response = await indexerClient
      .lookupAccountTransactions(address)
      .limit(50)
      .txType('pay')
      .do();

    if (!response || !Array.isArray(response.transactions)) {
      throw new Error('Invalid response format from indexer');
    }

    return response.transactions;
  } catch (error: unknown) {
    // Create a safe error message
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    console.error('Failed to fetch transactions:', errorMessage);

    throw new Error(errorMessage);
  }
}

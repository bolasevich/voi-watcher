// utils/blockchain.ts
import algosdk from 'algosdk';
import { ALGOD_API_URL, ALGOD_API_TOKEN } from '@/config';

interface AlgodError {
  status?: number;
  message?: string;
}

interface BlockchainError {
  message: string;
  status: number;
  originalError?: unknown;
}

export const algodClient = new algosdk.Algodv2(
  ALGOD_API_TOKEN,
  ALGOD_API_URL,
  ''
);

function isAlgodError(error: unknown): error is AlgodError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('status' in error || 'message' in error)
  );
}

function createBlockchainError(
  message: string,
  error: unknown
): BlockchainError {
  if (isAlgodError(error)) {
    return {
      message,
      status: error.status || 500,
      originalError: error,
    };
  }

  return {
    message,
    status: 500,
    originalError: error,
  };
}

export async function getWalletBalance(address: string): Promise<number> {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    return Number(accountInfo.amount);
  } catch (error: unknown) {
    console.error('Failed to fetch wallet balance:', error);
    throw createBlockchainError('Unable to fetch wallet balance.', error);
  }
}

export async function getAccountDetails(address: string): Promise<any> {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    return accountInfo;
  } catch (error: unknown) {
    console.error('Failed to fetch account details:', error);
    throw createBlockchainError('Unable to fetch account details.', error);
  }
}

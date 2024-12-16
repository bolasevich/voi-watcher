import { NextRequest, NextResponse } from 'next/server';
import { getAccountDetails, getWalletTransactions } from '@/utils/blockchain';
import algosdk from 'algosdk';

type ApiResponse =
  | algosdk.modelsv2.Account
  | algosdk.indexerModels.Transaction[]
  | { error: string; details?: string };

// Type for objects that might contain BigInt values
type BigIntValue =
  | bigint
  | string
  | number
  | boolean
  | null
  | undefined
  | BigIntObject
  | BigIntValue[];

interface BigIntObject {
  [key: string]: BigIntValue;
}

function handleError(error: unknown): NextResponse<ApiResponse> {
  console.error('API error:', error);
  return NextResponse.json<ApiResponse>(
    {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}

// Helper function to convert BigInt to string in objects
function convertBigIntToString(obj: BigIntValue): BigIntValue {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  if (typeof obj === 'object') {
    const converted: BigIntObject = {};
    for (const key in obj) {
      converted[key] = convertBigIntToString((obj as BigIntObject)[key]);
    }
    return converted;
  }

  return obj;
}

export async function GET(
  request: NextRequest,
  params: unknown
): Promise<Response> {
  try {
    const routeParams = await (
      params as { params: Promise<{ operation: string }> }
    ).params;
    const { operation } = routeParams;

    // Validate the address parameter
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    if (!address) {
      return NextResponse.json<ApiResponse>(
        { error: 'Address not specified' },
        { status: 400 }
      );
    }

    // Handle different operations
    switch (operation) {
      case 'account': {
        const accountInfo = await getAccountDetails(address);
        // Convert BigInt values to strings before sending response
        const serializedInfo = convertBigIntToString(
          accountInfo as unknown as BigIntValue
        );
        return NextResponse.json(serializedInfo);
      }

      case 'transactions': {
        const transactions = await getWalletTransactions(address);
        // Convert BigInt values to strings before sending response
        const serializedTxns = convertBigIntToString(
          transactions as unknown as BigIntValue
        );
        return NextResponse.json(serializedTxns);
      }

      default:
        return NextResponse.json<ApiResponse>(
          {
            error: 'Invalid operation',
            details: `Unsupported operation '${operation}'`,
          },
          { status: 400 }
        );
    }
  } catch (error) {
    return handleError(error);
  }
}

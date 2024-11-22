// app/api/[operation]/route.ts
import { NextResponse } from 'next/server';
import { getWalletBalance, getAccountDetails } from '@/utils/blockchain';
import type {
  ApiContext,
  BalanceResponse,
  AccountResponse,
  ErrorResponse,
} from '@/types/api';

type ApiResponse = BalanceResponse | AccountResponse | ErrorResponse;

function isBlockchainError(error: unknown): error is {
  message: string;
  status: number;
  originalError?: unknown;
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
}

function handleError(error: unknown): NextResponse<ErrorResponse> {
  console.error('API error:', error);

  if (isBlockchainError(error)) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.originalError ? String(error.originalError) : undefined,
      },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(
  request: Request,
  context: ApiContext
): Promise<NextResponse<ApiResponse>> {
  try {
    const params = await context.params;
    const operation = params?.operation;

    if (!operation) {
      return NextResponse.json(
        { error: 'Operation not specified' },
        { status: 400 }
      );
    }

    // Validate address parameter
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    if (!address) {
      return NextResponse.json(
        { error: 'Address not specified' },
        { status: 400 }
      );
    }

    // Handle operations
    switch (operation) {
      case 'balance': {
        const amountInMicroVoi = await getWalletBalance(address);
        const balance = amountInMicroVoi / 1e6;
        return NextResponse.json({
          address,
          balance,
        } as BalanceResponse);
      }

      case 'account': {
        const accountInfo = await getAccountDetails(address);
        return NextResponse.json(accountInfo as AccountResponse);
      }

      default:
        return NextResponse.json(
          {
            error: 'Invalid operation',
            details: `Operation '${operation}' is not supported`,
          },
          { status: 400 }
        );
    }
  } catch (error) {
    return handleError(error);
  }
}

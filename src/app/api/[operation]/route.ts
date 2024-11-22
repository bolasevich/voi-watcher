import { NextRequest, NextResponse } from 'next/server';
import { getAccountDetails } from '@/utils/blockchain';
import algosdk from 'algosdk';

type ApiResponse =
  | algosdk.modelsv2.Account
  | { error: string; details?: string };

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

export async function GET(
  request: NextRequest,
  params: unknown
): Promise<Response> {
  try {
    // Await the params before destructuring
    const routeParams = await (
      params as { params: Promise<{ operation: string }> }
    ).params;
    const { operation } = routeParams;

    if (operation !== 'account') {
      return NextResponse.json<ApiResponse>(
        {
          error: 'Invalid operation',
          details: `Unsupported operation '${operation}'`,
        },
        { status: 400 }
      );
    }

    // Validate the address parameter
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    if (!address) {
      return NextResponse.json<ApiResponse>(
        { error: 'Address not specified' },
        { status: 400 }
      );
    }

    // Fetch and return account details
    const accountInfo = await getAccountDetails(address);
    return NextResponse.json<ApiResponse>(accountInfo);
  } catch (error) {
    return handleError(error);
  }
}

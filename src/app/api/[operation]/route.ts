import { NextResponse } from 'next/server';
import { algodClient } from '@/utils/blockchain';

/**
 * API handler for blockchain operations.
 * @param request - HTTP request
 * @param params - Dynamic route parameters
 */
export async function GET(
  request: Request,
  { params }: { params: { operation: string } }
) {
  const { operation } = params;
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Missing address parameter' },
      { status: 400 }
    );
  }

  try {
    if (operation === 'balance') {
      // Fetch wallet balance
      const accountInfo = await algodClient.accountInformation(address).do();
      const balance = Number(accountInfo.amount) / 1e6; // Convert to Voi
      return NextResponse.json({ address, balance });
    } else if (operation === 'account') {
      // Fetch account details
      const accountInfo = await algodClient.accountInformation(address).do();
      return NextResponse.json(accountInfo);
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
  } catch (error) {
    console.error('Error in blockchain API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { algodClient } from '@/utils/blockchain';

export async function GET(
  request: Request,
  context: { params?: { operation?: string } }
) {
  const operation = context.params?.operation;

  if (!operation) {
    return NextResponse.json(
      { error: 'Operation not specified' },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address not specified' },
      { status: 400 }
    );
  }

  try {
    if (operation === 'balance') {
      const accountInfo = await algodClient.accountInformation(address).do();
      const balance = Number(accountInfo.amount) / 1e6;
      return NextResponse.json({ address, balance });
    }

    if (operation === 'account') {
      const accountInfo = await algodClient.accountInformation(address).do();
      return NextResponse.json(accountInfo);
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

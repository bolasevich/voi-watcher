export interface Transaction {
  txId: string;
  timestamp: number;
  from: string;
  to: string;
  amount: number;
  note?: string;
  type: 'received' | 'sent';
}

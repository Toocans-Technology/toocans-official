export interface WithdrawalRecord {
  id: string;
  amount: number;
  currency: string;
  token: string;
  time: string;
  state: 'pending' | 'completed' | 'failed';
  timestamp: string;
  address?: string;
  network?: string;
  txHash?: string;
}

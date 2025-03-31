export interface DepositRecord {
    id: number;
    token: string;
    amount: string;
    time: string;
    email: string;
    phone: string;
    network: string;
    status: 'completed' | 'pending';
  }
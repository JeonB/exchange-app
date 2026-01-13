import { useQuery } from '@tanstack/react-query';
import type { Wallet } from '../types/wallet.types';
import type { ApiResponse } from '../types/api.types';

async function fetchWallet(): Promise<Wallet> {
  const response = await fetch('/api/wallets');
  const data: ApiResponse<Wallet> = await response.json();

  if (!response.ok || data.code !== 'OK') {
    throw new Error(data.message || '지갑 조회에 실패했습니다.');
  }

  return data.data as Wallet;
}

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
    staleTime: 0, // Always refetch wallet data
  });
}

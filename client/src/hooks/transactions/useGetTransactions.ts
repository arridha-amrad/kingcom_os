import { privateAxios } from '@/lib/axiosInterceptor';
import type { User } from '@/types/api/auth';
import type { GetTransactionsResponse } from '@/types/api/transaction';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryKey = 'get-transactions';

export function useGetTransactions(auth: User | undefined) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getMyTransactions,
    staleTime: 5 * 60 * 1000,
    enabled: !!auth,
    retry(failureCount) {
      return failureCount < 2;
    },
  });
}

export const getMyTransactions = async () => {
  try {
    const res = await privateAxios.get<GetTransactionsResponse>('/orders');
    const data = res.data;
    return data.orders;
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data.error);
    }
    throw new Error('Something went wrong');
  }
};

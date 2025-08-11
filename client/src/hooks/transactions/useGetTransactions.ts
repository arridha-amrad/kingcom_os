import { privateAxios } from '@/lib/axiosInterceptor';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryKey = 'get-transactions';

export function useGetTransactions() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getMyTransactions,
  });
}

export const getMyTransactions = async () => {
  try {
    const res = await privateAxios.get('/orders');
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

import { privateAxios } from '@/lib/axiosInterceptor';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useGetCart() {
  const qc = useQueryClient();
  const auth = qc.getQueryData(['me']);
  const query = useQuery({
    queryKey: ['get-cart'],
    queryFn: getCart,

    enabled: () => {
      const data = qc.getQueryData(['get-cart']);
      return !data && !!auth;
    },
    retry(failureCount) {
      return failureCount < 2;
    },
  });
  return query;
}

export const getCart = async () => {
  try {
    const res = await privateAxios.get('/products/cart');
    const data = res.data;
    console.log({ data });
    return data.cart;
  } catch (err) {
    console.log(err);
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data.error);
    }
    throw new Error('something went wrong');
  }
};

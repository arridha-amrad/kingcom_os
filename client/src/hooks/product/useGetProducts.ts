import { publicAxios } from '@/lib/axiosInterceptor';
import type { GetProductsResponse, Product } from '@/types/api/product';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function useGetProducts() {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ['get-products'],
    enabled: () => {
      const data = qc.getQueryData(['get-products']) as
        | Product
        | null
        | undefined;
      return !data;
    },
    retry(failureCount) {
      return failureCount === 2;
    },
    queryFn: async () => {
      try {
        const res = await publicAxios.get<GetProductsResponse>('/products');
        const data = res.data;
        return data.products;
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data.error);
        }
      }
    },
  });
}

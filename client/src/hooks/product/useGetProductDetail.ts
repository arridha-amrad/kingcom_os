import { privateAxios } from '@/lib/axiosInterceptor';
import type { GetProductDetailResponse } from '@/types/api/product';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function useGetProductDetail(slug: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ['get-products', slug],
    queryFn: async () => {
      try {
        const res = await privateAxios.get<GetProductDetailResponse>(
          `/products/${slug}`,
        );
        const data = res.data;
        return data.product;
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data.error);
        }
      }
    },
    enabled: () => {
      const data = qc.getQueryData(['get-products', slug]);
      return !data;
    },
    retry(failureCount) {
      return failureCount < 2;
    },
  });
}

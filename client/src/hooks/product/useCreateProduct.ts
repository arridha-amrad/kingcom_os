import { privateAxios } from '@/lib/axiosInterceptor';
import type {
  CreteProductRequest,
  CreteProductResponse,
} from '@/types/api/product';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function useCreateProduct() {
  return useMutation({
    mutationKey: ['create-product'],
    mutationFn: async (params: CreteProductRequest) => {
      try {
        const res = await privateAxios.post<CreteProductResponse>(
          '/products',
          params,
        );
        const data = res.data;
        console.log({ params });
        return data.message;
      } catch (err: unknown) {
        console.log(err);
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data.error);
        }
      }
    },
    retry(failureCount) {
      return failureCount < 2;
    },
  });
}

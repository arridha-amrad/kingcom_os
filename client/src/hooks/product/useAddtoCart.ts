import { privateAxios } from '@/lib/axiosInterceptor';
import type { AddToCartRequest, AddToCartResponse } from '@/types/api/product';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function useAddToCart() {
  return useMutation({
    mutationFn: async (params: AddToCartRequest) => {
      try {
        const res = await privateAxios.post<AddToCartResponse>(
          '/products/add-to-cart',
          params,
        );
        const data = res.data;
        return data.message;
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data.error);
        }
      }
    },
  });
}

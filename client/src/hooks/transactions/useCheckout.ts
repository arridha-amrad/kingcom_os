import { privateAxios } from '@/lib/axiosInterceptor';
import type { CheckoutMutationResponse } from '@/types/api/transaction';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useCheckout(orderId: string) {
  return useMutation({
    mutationKey: ['checkout', orderId],
    mutationFn: async () => {
      try {
        const res = await privateAxios.post<CheckoutMutationResponse>(
          '/orders/checkout',
          {
            orderId,
          },
        );
        const data = res.data;
        return data;
      } catch (err: unknown) {
        console.log(err);
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data.error);
        }
        throw new Error('Something went wrong');
      }
    },
  });
}

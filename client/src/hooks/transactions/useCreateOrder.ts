import { privateAxios } from '@/lib/axiosInterceptor';
import type { PlaceOrderRequest } from '@/types/api/transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['create-order'],
    mutationFn: async ({ items, shipping, total }: PlaceOrderRequest) => {
      try {
        const res = await privateAxios.post<{ message: string }>('/orders', {
          total,
          items,
          shipping,
        });
        return res.data.message;
      } catch (err: unknown) {
        console.log(err);
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data.error);
        }
        throw new Error('Something went wrong');
      }
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['get-transactions'] });
      navigate({ to: '/transactions' });
    },
  });
};

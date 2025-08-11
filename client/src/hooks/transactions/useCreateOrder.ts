import { privateAxios } from '@/lib/axiosInterceptor';
import type { PlaceOrderRequest } from '@/types/api/transaction';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const useCreateOrder = () => {
  const navigate = useNavigate();
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
    // onSuccess(data) {
    //   toast.success(data);
    //   navigate({ to: '/' });
    // },
  });
};

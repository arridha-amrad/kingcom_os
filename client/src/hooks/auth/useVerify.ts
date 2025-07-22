import { publicAxios } from '@/lib/axiosInterceptor';
import type { VerifyRequest, VerifyResponse } from '@/types/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useVerify = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: VerifyRequest) => {
      try {
        const res = await publicAxios.post<VerifyResponse>(
          `/auth/verify`,
          params,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        return res.data;
      } catch (err: unknown) {
        console.log(err);
        if (err instanceof AxiosError) {
          throw new Error(err.message);
        }
      }
    },
    onSuccess: (data) => {
      if (!data) return;
      localStorage.setItem('auth', 'true');
      qc.setQueryData(['me'], data.user);
    },
  });
};
